// src/firebase-config.js
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Suas configurações Firebase
const firebaseConfig = 
    {
        "type": "service_account",
        "projectId": "dufal-d5852",
        "private_key_id": "20644104e01c7eb77b681ba8984033abe5a758d3",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUpywbdJispc/Z\nraNSzIQyUtomvwGXA25IGOIpSJ4pn46hfDoXGtnxDDqsKCBxjPBw1LXL5Fgut03G\nhwEvFCOp67pRCgWQlE1VG1QbIzYeApMoylfg/Gwc1ORBI+Ggu5pqLJm8Qmy1FTVT\njlYLUhlZqCOtFtWyx4j0ws2xC8r5UPspY5NU0KkRcmZj89FANZ9XsSy90uxG4Y8h\nTRldkshP6RXrqWs22xuzUDai1IoFJ+2j9WpCxSEtitCMpYPZs62hP8GyvLUEdlrT\nxx9zi5FMw/c7jDSn/03t0PDjYXDkRsAAGtK4IK+xzcUtUXSi09C6JpCuvipvXApA\nOVYKaavdAgMBAAECggEAZtsxH1qHGkLdRQmSjNL1Qi4G7GTIzRVQuzil85f3QGS3\npW4j3tcTAV+L5YdHIgUsqzaHdEZPTNFGojbcoLvaAC9PoDD7vhGtUfP0+2dNnrha\nG4m7dcxCMrPab5N+Z7M2HhLSjVeHoxLOB0s6XSFpt473Kpp35JBUsyaiPPdaRro9\n7VKK0Bgkf7nZpKAGKcUqgORXjSRp1d522x+D0P4X9tlXoxk34vk1BH59wzo9YxzY\nzkanQf1NbVM6wpm5rBzINAYjt/I+3gcaQpYwJpXb2jtR5rnU3RAMC+j2CEx/uoC7\nxJfFvg5McDzZXQUo9qnoDJ5Cv3y8YMoSq+PhQ+3b9QKBgQDum3nKmhFxUgIT1jfT\nTKiyWSRc4U0RNaUxHmQwMVIHEh1LR7OUc06Yk8pULeBpGLezVwR7ObG3FhQnlNaq\nYOb9l2cslO16hihDQTOEga8oxFlCyEEyrILh0mlMAzwIvDXLKe4T23nlgCHR0SD1\nyxhinTbcKAm/rlP9JRx69AyWIwKBgQDkJ2CB/KnPyXdeq/1WGii1eszNZPNPOL2y\nrM8Xq5Asmo3aYpIFJpFJALmoVA1YSiAyEfVrbrMCHdq4dYXKyHL6L3otMbmgdVMn\nRES2mUR+83ZbgFZ8rFvDIDv2LJjUDSdEofFy+TUyh/opV0Zn3CSGZKogtr6ojh3u\n7zUTCgfV/wKBgGVNPPf3UVB7MMabPDhJY5XUosuMG9wimm+wJ3kOd3TpC+baGjP8\ngHHmzQ/QKmZ0SAmr+AsZA4pnpUboufq8CVXA4dzbnbdXHeDv3Z90L5lvQzZHLucE\ntsyJOIs9FE/hGDWZJ6rmk2oMbE9YKlYwU7oKZTAzD3CB4sam6uCInI9hAoGAa/8v\nsZgWEaN9+7RR8OXlCzKbq0Xz3jYvpVojlULCtjpal1s9X27IKtRLDaDryDUeVFUn\n5Li7x262T8ZhlIGZ20+J98an5Ypj2Bx6oiyevbEk/18akV1M+mpRt8+YcBfh1J0L\nm67XPZocEmGblCIir/MKjP2z9jl/ddCJQP/ogaUCgYAKCtN4JD/uscjgNY9McofB\nTCfpBQvfdQfTRXj9sKhxZlNqAF0M7LP1ZLCqNBJ9VNg+YHaZGwGo5CZrErnqnVdA\nIsyGS7hQEr/u0tlUUQSbe8U3TZBdPtiWPHNUdm5W47xMhWw738SH+wC1enwsvdiA\nG9zTdhBRhGwLlrA7akx3Bw==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-n1jtf@dufal-d5852.iam.gserviceaccount.com",
        "client_id": "112163880742974744848",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n1jtf%40dufal-d5852.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
// Serviços do Firebase
const db = getFirestore(app);

export { db };
