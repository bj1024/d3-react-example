# d3-react-example

```
npx create-react-app . --template typescript
```

vulnerabilities

## move react-script to devDependenci

npmの設定ファイルpackage.jsonでreact-scriptをdependenciesからdevDependenciesに移してください。
その上で、npm
audit
--production
を使用するようにしてください。
Help, `npm audit`
says
I
have
a
vulnerability
in
react-scripts!
·
Issue
#11174
·
facebook/create-react-app https://github.com/facebook/create-react-app/issues/11174

## create-react-appのパラメータ。(host,portなど)

.env*
file.を編集する。

[Advanced Configuration \| Create React App](https://create-react-app.dev/docs/advanced-configuration)


