import babel from '@babel/core'
import presetEnv from '@babel/preset-env' //es6-to-es5 核心插件
import fs from 'node:fs'

const code=fs.readFileSync('./text.js', 'utf-8')

const result=babel.transform(code,{
    presets:[presetEnv]
})

console.log(result.code)