import { HttpStatus } from "@nestjs/common";
import { Controller, Get, HttpCode } from "@nestjs/common/decorators";

@Controller('')
export class AppController {
    constructor() {}

    @HttpCode(HttpStatus.OK)
    @Get('health')
    async healthCheck(): Promise<any> {
        return {
            status: 'UP'
        };
    }

}