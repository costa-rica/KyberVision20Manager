# Kyber Vision API Manager

#### 0.20.0

## .env

```
NEXT_PUBLIC_API_BASE_URL=https://api.kv20.dashanddata.com
NEXT_PUBLIC_APP_NAME=KyberVisionAPI20Manager
```

## install on server

### pm2 config

```
    {
      name: "KyberVision20Manager",
      script: "yarn",
      args: "start",
      interpreter: "/bin/bash",
      cwd: "/home/applications/KyberVision20Manager/",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      out_file: "/home/.pm2/logs/combined.log", // Standard output log
      error_file: "/home/.pm2/logs/combined-error.log", // Error log
      env: {
        NODE_ENV: "production",
        PORT: 8002, // The port the app will listen on
      },
    },
```

source: https://github.com/yarnpkg/yarn/issues/6124#issuecomment-541145153

## FontAwesome install

- install:

```bash
yarn add @fortawesome/fontawesome-svg-core
yarn add @fortawesome/free-solid-svg-icons
yarn add @fortawesome/react-fontawesome
```
