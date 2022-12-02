import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthDto } from "./dto";
import * as argon from 'argon2'

@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService){}
    async signup(dto:AuthDto){
        try{
            const hash = await argon.hash(dto.password);

            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash,
                }
            });
    
            delete user.hash;
    
            return user;

        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException('Credentials Taken');
                }
            }
            
            throw error;
        }


        // return {msg:'I am signed Up'}
    }

    async signin(dto:AuthDto){
        // const user =
        // await this.prisma.user.findUnique({
        //   where: {
        //     email:dto.email
        //   },
          
        // });

        // if(!user) throw new ForbiddenException('Credentials Incorrect');

        // const pwMatch = await argon.verify(user.hash,dto.password);

        // if(!pwMatch)throw new ForbiddenException('Credentials Incorrect');
        

        // delete user.hash;
        // return user;
    }

}