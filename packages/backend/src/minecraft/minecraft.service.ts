import { Injectable } from "@nestjs/common"



@Injectable()
export class MinecraftService {
  public async regionEnter(uuid: string, region: string) {
    console.log(uuid, " entered", region);
  }

  public async playerLeave(uuid: string) {
    console.log(uuid, " left");
    
  }
}
