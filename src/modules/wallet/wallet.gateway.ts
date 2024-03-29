import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Socket } from "socket.io"
import { Injectable, OnModuleInit } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { MemberRole, member, user } from "@prisma/client"
import { token } from "src/utils/token";
import { WalletService } from "./wallet.service";
@Injectable()
@WebSocketGateway({
  cors: true
})
export class WalletGateway implements OnModuleInit {

  @WebSocketServer()
  private serverSocket: Socket

  public userTopUpList: {
    socket: Socket,
    tokenCode: string,
    data: user,
    loginAt: string
  }[] = []
  public memberLoginList: {
    socket: Socket,
    tokenCode: string,
    data: member,
    loginAt: string
  }[] = []
  constructor(private readonly walletService: WalletService, private readonly prisma: PrismaService) { }

  onModuleInit() {
    this.serverSocket.on("connection", async (socket) => {
      const tokenCode = socket.handshake.auth.token || socket.handshake.query.token;
      if (tokenCode) {
        let tokenData = await this.tokeAuthen(tokenCode);
        if (!tokenData) {
          console.log("Xác thực thất bại!");
          socket.emit("state", {
            message: "Xác thực thất bại Top_Up!",
            data: null,
            invalidToken: true
          })
          // socket.disconnect();
        } else {
          this.userTopUpList.push({
            socket,
            tokenCode,
            data: tokenData,
            loginAt: String(Date.now())
          })
          console.log(`Người dùng: ${(tokenData as user).firstName} ${(tokenData as user).lastName} vừa truy cập vào trang nạp tiền!`)
        }



      }
      const tokenCodeMember = socket.handshake.auth.tokenMember || socket.handshake.query.tokenMember;
      if (tokenCodeMember) {
        let tokenData = await this.tokeAuthenMember(tokenCodeMember);
        if (!tokenData) {
          socket.emit("status", {
            message: "Xác thực thất bại!",
            data: null,
            invalidToken: true
          })
          socket.disconnect();
        } else {
          /* Check xem token đã dùng chưa */
          if (!this.memberLoginList.find(client => client.tokenCode == tokenCode)) { // token chưa trùng
            /* Check xem token có được tạo ra cùng 1 tài khoản không */
            if (this.memberLoginList.find(client => client.data.id == (tokenData as member).id)) {
              socket.emit("status", {
                message: "Xác thức thất bại! Tài khoản đã được đăng nhập ở một nơi khác!",
                data: null,
                invalidToken: false
              })
              socket.disconnect();
              return
            }
          }
  
          this.memberLoginList.push({
            socket,
            tokenCode,
            data: tokenData,
            loginAt: String(Date.now())
          })
  
          socket.emit("status", {
            message: "Thành công!",
            data: tokenData
          })
  
          console.log(`Người dùng: ${(tokenData as member).firstName} ${(tokenData as member).lastName} vừa truy cập!`)
          try {
            await this.walletService.createLog({
              memberId: (tokenData as member).id,
              note: `Thành viên: ${(tokenData as member).firstName} ${(tokenData as member).lastName} truy cập hệ thống!`,
              createTime: String(Date.now())
            })
          } catch (err) { }
  
          /* master send logs file */
          this.sendLog()
          this.sendMemberList()
          this.sendOnlineList()
          this.masterSocketOn(socket, tokenData)
        }
        socket.on('disconnect', () => {
          this.memberLoginList = this.memberLoginList.filter(client => client.socket.id != socket.id)
          socket.disconnect();
          console.log(`Người dùng: ${(tokenData as member).firstName} ${(tokenData as member).lastName} vừa đăng xuất!`)
          this.sendOnlineList()
        });
      }
      
    })
  }

  async topUpSuccess(userName: string, data: user) {
    let userSocket = this.userTopUpList.find((client) => client.data.userName == userName);
    for (let i in this.userTopUpList) {
      if (this.userTopUpList[i].data.userName == userName) {
        console.log("da vao", userSocket.data);
        let tokenCode = token.createToken(data)
        this.userTopUpList[i].socket.emit("topUp", {
          message: "Nạp tiền thành công!",
          data,
          tokenCode
        });
      }

    }
  }
  async tokeAuthen(tokenCode: string) {
    try {
      let tokenData = token.decodeToken(tokenCode)
      let member = await this.prisma.user.findUnique({
        where: {
          id: (tokenData as user).id
        }
      })
      console.log("member", member);

      if (!member) throw false

      return member
    } catch (err) {
      console.log("err", err);
      return false
    }
  }

  async masterSocketOn(socket: Socket, tokenData: member) {
    if (tokenData.role != MemberRole.master) return
    socket.on("masterKick", async (data: {
      socketId: string,
      reason: string,
      targetMember: member
    }) => {
      for (let i in this.memberLoginList) {
        if (this.memberLoginList[i].socket.id == data.socketId) {
          this.memberLoginList[i].socket.emit("kick", data.reason);
          this.sendOnlineList()
          this.memberLoginList[i].socket.disconnect();
          this.memberLoginList.splice(Number(i), 1);
          try {
            await this.walletService.createLog({
              memberId: (tokenData as member).id,
              note: `Master vừa đăng xuất thành viên ${data.targetMember.loginId}`,
              createTime: String(Date.now())
            })
            this.sendLog()
          } catch (err) { }
          break
        }
      }
    })
  }

  async tokeAuthenMember(tokenCode: string) {
    try {
      let tokenData = token.decodeToken(tokenCode)

      let member = await this.prisma.member.findUnique({
        where: {
          id: (tokenData as member).id
        }
      })

      if (!member) throw false
      if (member.updateTime != (tokenData as member).updateTime) throw false

      return member
    } catch (err) {
      return false
    }
  }

  async sendLog(socketClient: null | Socket = null) {
    if (socketClient != null) {
      let { data, err } = await this.walletService.findLogMany()
      if (!err) {
        socketClient.emit("logs", data)
      }
      return
    }
    for (let i in this.memberLoginList) {
      if (JSON.parse(this.memberLoginList[i].data.permission).find((per: string) => per == "r:log")) {
        let { data, err } = await this.walletService.findLogMany()
        if (!err) {
          this.memberLoginList[i].socket.emit("logs", data)
        }
      }
    }
  }

  async sendMemberList(socketClient: null | Socket = null) {
    if (socketClient != null) {
      let { data, err } = await this.walletService.findMemberMany()
      if (!err) {
        socketClient.emit("members", data)
      }
      return
    }
    for (let i in this.memberLoginList) {
      if (JSON.parse(this.memberLoginList[i].data.permission).find((per: string) => per == "r:member")) {
        let { data, err } = await this.walletService.findMemberMany()
        if (!err) {
          this.memberLoginList[i].socket.emit("members", data)
        }
      }
    }
  }

  async sendOnlineList() {
    for (let i in this.memberLoginList) {
      if (this.memberLoginList[i].data.role == MemberRole.master) {
        this.memberLoginList[i].socket.emit("online-list", this.memberLoginList.map(client => {
          return {
            socketId: client.socket.id,
            data: client.data,
            loginAt: client.loginAt
          }
        }))
      }
    }
  }

}
