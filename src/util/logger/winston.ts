import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = winston.format;

const logDir = 'logs'; // logs 디렉토리 하위에 로그 파일 저장
const logFormat = printf(
  (info) => `${info.timestamp} ${info.level}: ${info.message}`,
);

const options = {
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // 콘솔에 로그를 출력하는 설정
    new winston.transports.Console({
      format: combine(
        colorize(), // 색상 추가
        logFormat,
      ),
      level: 'info', // 콘솔에 출력할 로그 레벨 설정
    }),
    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.log',
      maxFiles: 7, // 7일치 로그 파일 저장
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`, // error.log 파일은 /logs/error 하위에 저장
      filename: '%DATE%.error.log',
      maxFiles: 7,
      zippedArchive: true,
    }),
  ],
};

export default options;
