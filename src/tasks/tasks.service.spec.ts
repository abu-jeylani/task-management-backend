import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockTasksService = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
});

const mockUser: User = {
  username: 'Abu',
  id: 'someid',
  password: 'password',
  tasks: [],
};

describe('Tasks Service', () => {
  let tasksService: TasksService;

  beforeEach(async () => {
    //initialize a nestjs module with tasksService and tasksrepo
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksService,
          useFactory: mockTasksService,
        },
      ],
    }).compile();
    tasksService = module.get(TasksService);
  });

  describe('getTasks', () => {
    it('calls taskservice.getTasks and returns the result', async () => {
      (tasksService.getTasks as jest.Mock).mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTasksById', () => {
    it('calls tasks service.getTaskById and returns the result', async () => {
      const mockTask: Task = {
        title: 'test title',
        description: 'test desc',
        id: 'someid',
        status: TaskStatus.OPEN,
        user: mockUser,
      };
      (tasksService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls tasks service.getTaskById and handles error', async () => {
      (tasksService.getTaskById as jest.Mock).mockResolvedValue(
        NotFoundException,
      );

      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(NotFoundException);
    });
  });
});
