import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsService } from './workshops.service';

const mockWorkshop = {
  id: '507f1f77bcf86cd799439011',
  name: 'Docker Workshop',
  notions: [{ id: '507f1f77bcf86cd799439012', name: 'Containers' }],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockWorkshopsService = {
  create: jest.fn().mockResolvedValue(mockWorkshop),
  findAll: jest.fn().mockResolvedValue([mockWorkshop]),
  findOne: jest.fn().mockResolvedValue(mockWorkshop),
  update: jest
    .fn()
    .mockResolvedValue({ ...mockWorkshop, name: 'CI/CD Workshop' }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('WorkshopsController', () => {
  let controller: WorkshopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkshopsController],
      providers: [
        { provide: WorkshopsService, useValue: mockWorkshopsService },
      ],
    }).compile();

    controller = module.get<WorkshopsController>(WorkshopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a workshop', async () => {
      const result = await controller.create({
        name: 'Docker Workshop',
        notions: ['507f1f77bcf86cd799439012'],
      });

      expect(result).toEqual(mockWorkshop);
    });
  });

  describe('findAll', () => {
    it('should return all workshops', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockWorkshop]);
    });
  });

  describe('findOne', () => {
    it('should return a workshop by id', async () => {
      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockWorkshop);
    });

    it('should throw NotFoundException for unknown id', async () => {
      mockWorkshopsService.findOne.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(
        controller.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a workshop', async () => {
      const result = await controller.update('507f1f77bcf86cd799439011', {
        name: 'CI/CD Workshop',
      });

      expect(result.name).toBe('CI/CD Workshop');
    });
  });

  describe('remove', () => {
    it('should delete a workshop', async () => {
      await expect(
        controller.remove('507f1f77bcf86cd799439011'),
      ).resolves.toBeUndefined();
    });
  });
});
