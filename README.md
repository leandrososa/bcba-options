# bcba-options

<span color="red">This repo will be refactored soon to be an API.</span>

## Uso

Requiere Node.js 20.18.1 o superior.

```sh
npm ci
npm start
```

También se puede iniciar en Windows con <code>run.bat</code>. El archivo <code>calls-ggal.json</code> se sobrescribe cada cinco minutos. En <code>index.html</code> se pueden visualizar los datos en un gráfico de burbujas.

### Datos de prueba

Para generar datos locales de muestra sin conectarse a Allaria:

```sh
npm run generate:sample
```

El comando usa [fixtures/opciones-demo.html](fixtures/opciones-demo.html) y escribe el resultado en `calls-ggal.sample.json`, sin modificar los datos de producción.
