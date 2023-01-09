import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post('/')
  createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: User) {
    console.log(createTaskDto);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    return await this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
