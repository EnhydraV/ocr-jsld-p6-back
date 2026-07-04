import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotionsController } from './notions.controller';
import { NotionsService } from './notions.service';

const mockNotion = {
  id: '507f1f77bcf86cd799439011',
  name: 'JavaScript',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockNotionsService = {
  create: jest.fn().mockResolvedValue(mockNotion),
  findAll: jest.fn().mockResolvedValue([mockNotion]),
  findOne: jest.fn().mockResolvedValue(mockNotion),
  update: jest.fn().mockResolvedValue({ ...mockNotion, name: 'TypeScript' }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('NotionsController', () => {
  let controller: NotionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotionsController],
      providers: [
        { provide: NotionsService, useValue: mockNotionsService },
      ],
    }).compile();

    controller = module.get<NotionsController>(NotionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a notion', async () => {
      const result = await controller.create({ name: 'JavaScript' });

      expect(result).toEqual(mockNotion);
      expect(mockNotionsService.create).toHaveBeenCalledWith({
        name: 'JavaScript',
      });
    });
  });

  describe('findAll', () => {
    it('should return all notions', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockNotion]);
    });
  });

  describe('findOne', () => {
    it('should return a notion by id', async () => {
      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockNotion);
    });

    it('should throw NotFoundException for unknown id', async () => {
      mockNotionsService.findOne.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(
        controller.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a notion', async () => {
      const result = await controller.update('507f1f77bcf86cd799439011', {
        name: 'TypeScript',
      });

      expect(result.name).toBe('TypeScript');
    });
  });

  describe('remove', () => {
    it('should delete a notion', async () => {
      await expect(
        controller.remove('507f1f77bcf86cd799439011'),
      ).resolves.toBeUndefined();
    });
  });
});
