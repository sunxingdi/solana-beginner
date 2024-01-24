# Solana开发环境搭建

（推荐Linux，Windows环境问题很多）

整体安装指导：https://www.anchor-lang.com/docs/installation

---
### 安装rust

Linux安装方法：
```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装完成后验证方法：
```shell
> rustc -V
rustc 1.74.1 (a28077b28 2023-12-04)

> cargo -V
cargo 1.74.1 (ecb9851af 2023-10-18)
```

---
### 安装Solana CLI

Linux安装方法：
```shell
执行安装命令：sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
添加环境变量：/etc/profile 增加 PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
加载环境变量：source /etc/profile
```

Windows安装方法：
```shell
软件下载地址：https://github.com/solana-labs/solana/releases
管理员运行CMD：solana-install-init-x86_64-pc-windows-msvc.exe v1.17.17
```

安装完成后验证方法：
```shell
> solana --version
solana-cli 1.17.17 (src:27a43800; feat:1337574167, client:SolanaLabs)
```

Solana版本升级方法：
```shell
solana-install update
```

---
### 安装nodejs和npm
```
//Linux安装命令，可能版本不是最新的
sudo apt-get install nodejs
sudo apt-get install npm

//Linux安装指定版本nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
//重启shell
command -v nvm
nvm install 20.11.0
```

安装完成后验证方法：
```
//查询node版本
node -v
//查询npm版本
npm -v
```

配置npm
```
//查看node全局模块路径和缓存路径
npm config get cache 
npm config get prefix 

//配置node全局模块路径和缓存路径
npm config set cache "D:\nodejs\cache"
npm config set prefix "D:\nodejs\npm"

//查看node源
npm config get registry

//配置node源
npm config set registry http://mirrors.cloud.tencent.com/npm/
```

---
### 安装yarn
```
npm install -g yarn
```

---
### 安装Anchor CLI
```
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev

avm install latest

avm use latest
```

安装完成后验证方法：
```
anchor --version
```