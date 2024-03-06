import { ExecutionEngineController } from "@controllers/execution-engine.controller";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ExecutionEngineService } from "@services/execution-engine.service";
import { join } from "path";
import { ExecutionEngineProcessor } from "src/processors/execution-engine.processor";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'execution-engine',
        }),
    ],
    controllers: [ExecutionEngineController],
    providers: [
        ExecutionEngineService,
        ExecutionEngineProcessor
    ],
})
export class ExecutionEngineModule {}