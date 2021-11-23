# FlyFish

FlyFish server repo

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ chmod +x startup.sh
$ ./startup.sh
$ open http://localhost:7001/
```

### Deploy

修改 startup.sh:
```
npm run dev   =>  npm run prod
```

```bash
$ chmod +x startup.sh
$ ./startup.sh
$ open http://${ip}:7001/
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org