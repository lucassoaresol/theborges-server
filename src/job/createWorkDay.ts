import { Prisma } from '@prisma/client';
import { CronJob } from 'cron';
import { Dayjs } from 'dayjs';

import dayLib from '../libs/dayjs.js';
import { prismaClient } from '../libs/prismaClient.js';

const upsertWorkingDay = async (
  date: Date,
  professionalId: number,
  isClosed: boolean,
  workHours: any,
) => {
  return prismaClient.workingDay.upsert({
    create: { date, isClosed, time: workHours, professionalId },
    update: { isClosed, time: workHours },
    where: { professionalId_date: { date, professionalId } },
  });
};

const handleHolidayExceptions = async (date: Date, professionalId: number) => {
  const holidayException = await prismaClient.holidayException.findUnique({
    where: {
      date,
      professionals: { every: { professionalId } },
    },
  });

  if (holidayException) {
    const workHours =
      holidayException.time === null ? Prisma.JsonNull : holidayException.time;

    return upsertWorkingDay(
      date,
      professionalId,
      holidayException.isClosed,
      workHours,
    );
  }

  return null;
};

const handleOperatingHours = async (
  date: Date,
  dayOfWeek: number,
  professionalId: number,
) => {
  const operatingHours = await prismaClient.operatingHours.findFirst({
    where: { dayOfWeek },
  });

  if (operatingHours) {
    const workHours =
      operatingHours.time === null ? Prisma.JsonNull : operatingHours.time;
    return upsertWorkingDay(date, professionalId, false, workHours);
  }

  return upsertWorkingDay(date, professionalId, true, Prisma.JsonNull);
};

const processProfessionalWorkDay = async (
  date: Dayjs,
  professionalId: number,
) => {
  const holidayProcessed = await handleHolidayExceptions(
    date.toDate(),
    professionalId,
  );
  if (holidayProcessed) {
    return holidayProcessed;
  }
  return handleOperatingHours(date.toDate(), date.day(), professionalId);
};

const processWorkingDaysJob = async () => {
  try {
    console.log('Starting the job to process working days...');

    let currentDay = dayLib().startOf('day');
    const futureDateLimit = currentDay.add(61, 'day');
    const professionals = await prismaClient.professional.findMany();

    await prismaClient.workingDay.deleteMany({
      where: { date: { lt: currentDay.toDate() } },
    });

    while (
      currentDay.isBefore(futureDateLimit) ||
      currentDay.isSame(futureDateLimit)
    ) {
      const dayProcessingPromises = professionals.map((professional) =>
        processProfessionalWorkDay(currentDay, professional.id),
      );

      await Promise.all(dayProcessingPromises);

      currentDay = currentDay.add(1, 'day');
    }

    console.log('Working days processing job completed successfully!');
  } catch (error) {
    console.error('Error during the working days job execution:', error);
  }
};

CronJob.from({
  cronTime: '0 0 0 * * *',
  onTick: processWorkingDaysJob,
  start: true,
});
