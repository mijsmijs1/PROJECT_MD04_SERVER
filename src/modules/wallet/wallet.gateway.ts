import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Socket } from 'socket.io'
import { OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MemberRole, member, user } from '@prisma/client'
import { token } from 'src/utils/token';
import { WalletService } from './wallet.service';
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

  constructor(private readonly walletService: WalletService, private readonly prisma: PrismaService) { }

  onModuleInit() {
    this.serverSocket.on('connection', async (socket) => {
      const tokenCode = socket.handshake.auth.token || socket.handshake.query.token;
      let tokenData = await this.tokeAuthen(tokenCode);
      if (!tokenData) {
        console.log("Xác thực thất bại!");
        socket.emit('state', {
          message: "Xác thực thất bại!",
          data: null,
          invalidToken: true
        })
        socket.disconnect();
      } else {
        this.userTopUpList.push({
          socket,
          tokenCode,
          data: tokenData,
          loginAt: String(Date.now())
        })

        console.log(`Người dùng: ${(tokenData as user).firstName} ${(tokenData as user).lastName} vừa truy cập!`)


      }
      socket.on('disconnect', () => {
        this.userTopUpList = this.userTopUpList.filter(client => client.socket.id != socket.id)
        socket.disconnect();
        console.log(`Người dùng: ${(tokenData as user).firstName} ${(tokenData as user).lastName} vừa đăng xuất!`)

      });
    })
  }

  topUpSuccess(userName: string, data: user) {
    let userSocket = this.userTopUpList.find((client) => client.data.userName == userName);
    if (userSocket) {
      userSocket.socket.emit('topUp', {
        message: 'Nạp tiền thành công!',
        data
      });
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
      console.log('member', member);

      if (!member) throw false

      return member
    } catch (err) {
      console.log('err',err);
      return false
    }
  }

}
