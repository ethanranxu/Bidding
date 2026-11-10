const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(sources, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    // 如果源是目录，则复制其内容
    if (fs.lstatSync(sources).isDirectory()) {
        const files = fs.readdirSync(sources);
        files.forEach((file) => {
            const curSource = path.join(sources, file);
            const curTarget = path.join(target, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, curTarget);
            } else {
                fs.copyFileSync(curSource, curTarget);
            }
        });
    }
}

console.log('开始执行自动化部署整理 (postbuild)...');

// 1. 复制 public 文件夹
const publicSrc = path.join(__dirname, 'public');
const publicDest = path.join(__dirname, '.next', 'standalone', 'public');
if (fs.existsSync(publicSrc)) {
    console.log('正在拷贝 public 静态资源...');
    copyFolderRecursiveSync(publicSrc, publicDest);
}

// 2. 复制 .next/static 文件夹
const staticSrc = path.join(__dirname, '.next', 'static');
const staticDest = path.join(__dirname, '.next', 'standalone', '.next', 'static');
if (fs.existsSync(staticSrc)) {
    console.log('正在拷贝 .next/static 前端静态文件...');
    copyFolderRecursiveSync(staticSrc, staticDest);
}

// 2.5 复制 .env.local 配置文件到 standalone 根目录
const envSrc = path.join(__dirname, '.env.local');
const envDest = path.join(__dirname, '.next', 'standalone', '.env.local');
if (fs.existsSync(envSrc)) {
    console.log('正在拷贝 .env.local 环境变量文件...');
    fs.copyFileSync(envSrc, envDest);
}

const webConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
    </handlers>

    <rewrite>
      <rules>
        <!-- 关键：清除从父站点继承下来的所有重写规则（防盗链等规则会导致静态资源 403） -->
        <clear />
        <!-- iisnode 日志目录不重写，方便排错时直接浏览 -->
        <rule name="IisnodeLogs" stopProcessing="true">
          <match url="^iisnode(/.*)?$" />
          <action type="None" />
        </rule>
        <!-- 所有请求（含 _next 静态资源）统一交给 server.js，由 Next.js standalone 自己服务静态文件 -->
        <rule name="NodeJsAll" stopProcessing="true">
          <match url=".*" />
          <action type="Rewrite" url="server.js" />
        </rule>
      </rules>
    </rewrite>

    <iisnode 
      node_env="production"
      nodeProcessCommandLine="C:\\Program Files\\nodejs\\node.exe"
      watchedFiles="web.config"
      loggingEnabled="true"
      logDirectory="iisnode"
      devErrorsEnabled="true"
    />

    <security>
      <requestFiltering>
        <requestLimits maxAllowedContentLength="1073741824" />
      </requestFiltering>
    </security>

    <!-- 保留 node 返回的原始响应（含 404/错误页），不被 IIS 错误页替换 -->
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>`;

const webConfigDest = path.join(__dirname, '.next', 'standalone', 'web.config');
fs.writeFileSync(webConfigDest, webConfigContent, 'utf8');
console.log('已生成 web.config 配置文件！');

// 4. 自动生成一键启动的 start.bat (备用，如果不使用 iisnode 时)
const batContent = `@echo off
title Bidding App Next.js Server
set PORT=3000
echo Starting Next.js standalone server on port %PORT%...
node server.js`;

const batDest = path.join(__dirname, '.next', 'standalone', 'start.bat');
fs.writeFileSync(batDest, batContent, 'utf8');
console.log('已生成 start.bat 启动文件！');

// 5. 自动修补 server.js 以兼容 iisnode 的 Windows 命名管道 (Named Pipe)
const standaloneServerJsPath = path.join(__dirname, '.next', 'standalone', 'server.js');
if (fs.existsSync(standaloneServerJsPath)) {
    let serverJsContent = fs.readFileSync(standaloneServerJsPath, 'utf8');
    const targetCode = "const currentPort = parseInt(process.env.PORT, 10) || 3000";
    const replacementCode = "const currentPort = (process.env.PORT && isNaN(process.env.PORT)) ? process.env.PORT : (parseInt(process.env.PORT, 10) || 3000)";
    if (serverJsContent.includes(targetCode)) {
        serverJsContent = serverJsContent.replace(targetCode, replacementCode);
        fs.writeFileSync(standaloneServerJsPath, serverJsContent, 'utf8');
        console.log('已成功为 server.js 应用 iisnode 命名管道兼容性补丁！');
    }
}

console.log('自动化部署整理已全部完成！直接将 .next/standalone 目录拷贝至 IIS 物理路径即可部署。');
