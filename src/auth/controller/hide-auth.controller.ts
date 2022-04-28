import { Body, Post } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { CreateUserDto } from "../dto";
import { AuthService } from "../service";

@Controller('hide-auth')
export class HideAuthController{
    constructor(private authService: AuthService){}

    @Post()
    async createAdminUser(@Body()createUserDto: CreateUserDto){
        return this.authService.createAdminUser(createUserDto);
    }

    @Get()
    async getAllUser(){
        return this.authService.getAllUser();
    }
}