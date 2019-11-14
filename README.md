# ppdl-demo

通过puppeter获取部分省份的指定交通罚单记录并保存到oss，目前支持广东、江西、浙江；

## usage

```bash
node index
```

见index注释。serialNo必填；type如果用tessact，需要自己提前装好并配置好环境变量；如果用fateadm，需要自己提前买好对应服务；其他识别器自己写了也可以插进recognizer里面；

这个项目主要是梳理了一下通过puppeter对以上省份的查询流程；
