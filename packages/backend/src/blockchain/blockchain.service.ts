import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {


    public async helloWorld() {
        console.log("Hello World");
    }
}
