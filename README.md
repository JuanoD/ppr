# Programación por Restricciones

Esta carpeta contiene el código fuente de la aplicación web desarrollada como proyecto de curso, el informe del proyecto, y los modelos desarrollados. A continuación de describen los contenidos de la carpeta.

- client/

  Esta carpeta contiene el código fuente del cliente web.

- server/
  
  Esta carpeta contiene el código fuente del servidor web.

- informe.pdf
  
  Informe del desarrollo del proyecto.

- Modelo/

  Esta carpeta contiene los modelos desarrollados, y dentro una carpeta con los archivos de prueba. Los archivos .mzp (minizinc project) abren cada modelo y sus respectivos archivos de prueba.

Para correr este proyecto es necesario tener Node.js y npm (Por lo general viene con Node.js) instalado. Puede ser necesario agregar las instalaciones de estos al PATH del sistema.

Este proyecto aún no ha sido configurado para un ambiente de producción, la ejecución del proyecto es la misma usada para el desarrollo del mismo.

## Cliente

Es necesario ejecutar este comando

```
npm install -g @angular/cli
```

Este comando permite la ejecución de comandos del CLI de angular.

Ahora, es necesario cambiar de directorio a la carpeta `client`

```
cd client
```

Luego, es necesario instalar las dependencias del proyecto. Este comando instalará las dependencias listadas en el archivo `package.json`

```
npm install
```

Finalmente, para correr el cliente se ejecuta

```
ng serve
```

Esto hará disponible el cliente en localhost:4200 en el navegador.

## Servidor

En otro terminal, ejecutar estos comandos

```
cd server
npm install
npm run start:dev
```

Esto hará que el servidor esté disponible. Al momento de entregar el proyecto, lo único que hace es recibir peticiones del cliente para resolver CSPs.
