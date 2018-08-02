# iBase angular template

Recreation of the iBase template in angular from scratch.   
version: 1.0.0  
See CHANGELOG.md for changes

## installation

`cd admin-src2`  
`npm install`  
This will install all the required dependencies, 
all commands are to be run in context of `admin-src2` directory.

## Demo code

All of the components are here for demo purpose.

## Development server

There are 2 ways to run a dev server.

1. `ng serve` - this will compile the code in RAM and served to port 4200
    Navigate to `http://localhost:4200/`.
2. `ng build --watch` - this will build to the output directory and look for changes, you must use Xampp/Apache to server it yourself.
    Navigate to `http://localhost/path/to/output/`. 


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

`ng build --base-href=/admin/src/` - will build the code   
`ng build --base-href=/admin/src/ --prod` - will build production code.  
`--base-href=/path/to/build` is the relative path where the code lives.  


Author
— Boniface Pereira