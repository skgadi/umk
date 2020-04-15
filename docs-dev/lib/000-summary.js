const bSummary = {
    categories:[{"id":"sources","icon":"","name":{"en-us":"Sources","es-mx":"Fuentes"},"desc":{"en-us":"Sources generate the signals to feed to the model.","es-mx":"Las fuentes generan las señales para alimentar al modelo."}},{"id":"sinks","icon":"","name":{"en-us":"Sinks","es-mx":"Fregaderos"},"desc":{"en-us":"Sinks output the information. They can be graphs or file download","es-mx":"Los sumideros generan la información. Pueden ser gráficos o descarga de archivos"}},{"id":"basics","icon":"","name":{"en-us":"Basic operations","es-mx":"Operaciones básicas"},"desc":{"en-us":"Basic mathematical operations are given","es-mx":"Se dan operaciones matematicas basicas"}},{"id":"logics","icon":"","name":{"en-us":"Logical operations","es-mx":"Operaciones lógicas"},"desc":{"en-us":"Logical operations are available in this section","es-mx":"Las operaciones lógicas están disponibles en esta sección."}},{"id":"continuous","icon":"","name":{"en-us":"Continuous time","es-mx":"Tiempo continuo"},"desc":{"en-us":"Dynamic operations are available here for continuous time operations","es-mx":"Las operaciones dinámicas están disponibles aquí para operaciones de tiempo continuo"}},{"id":"discrete","icon":"","name":{"en-us":"Discrete time","es-mx":"Tiempo discreto"},"desc":{"en-us":"Dynamic operations are available here for discrete time operations","es-mx":"Las operaciones dinámicas están disponibles aquí para operaciones de tiempo discreto"}},{"id":"hardware","icon":"","name":{"en-us":"Hardware tools","es-mx":"Herramientas de hardware"},"desc":{"en-us":"Hardware i/o blocks are available here","es-mx":"Los bloques de E / S de hardware están disponibles aquí"}}],
    blocks:{"umk_1585601356516":{"icon":"<line x1='20' y1='50' x2='80' y2='50' /><line x1='50' y1='20' x2='50' y2='80'/>","bg":"#1595C8","fg":"#ffffff","width":50,"height":50,"keywords":"sum add addition summation sumar aggregar plus","category":["basics","hardware"],"name":{"en-us":"Sum","es-mx":"Suma"},"desc":{"en-us":"Adds two number, vectors, or matrices.","es-mx":"Agrega dos números, vectores o matrices."}},"umk_1586108946421":{"icon":"<text x='50' y='57' dominant-baseline='middle' text-anchor='middle' font-size='5em'>C</text>","bg":"#1595C8","fg":"#ffffff","width":50,"height":50,"keywords":"constant","category":["sources"],"name":{"en-us":"Constant","es-mx":"Constante"},"desc":{"en-us":"A constant of scalar, vector or a matrix","es-mx":"Una constante de escalar, vector o una matriz"}},"umk_1586901838454":{"icon":"<text x='50' y='57' dominant-baseline='middle' text-anchor='middle' font-size='5em' stroke-width='4'>#</text>","bg":"#1595C8","fg":"#ffffff","width":50,"height":50,"keywords":"display","category":["sinks"],"name":{"en-us":"Display","es-mx":"Monitor"},"desc":{"en-us":"Displays the instantaneous result","es-mx":"Muestra el resultado instantáneo."}},"umk_1586738484106":{"icon":"<g stroke-width='5'><line x1='10' y1='50' x2= '90' y2='50'/> <line x1='5' y1='50' x2= '95' y2='50'/> <line x1='10' y1='5' x2= '10' y2='95'/> <line x1='30' y1='57' x2= '30' y2='43'/> <line x1='50' y1='57' x2= '50' y2='43'/> <line x1='70' y1='57' x2= '70' y2='43'/> <line x1='90' y1='57' x2= '90' y2='43'/> <line x1='3' y1='10' x2= '17' y2='10'/> <line x1='3' y1='30' x2= '17' y2='30'/> <line x1='3' y1='70' x2= '17' y2='70'/> <line x1='3' y1='90' x2= '17' y2='90'/> <g stroke-width='1'> <polyline points='10,50 20,10 30,30 40,40 50,70 60,30 70,90 80,20 90,40'/> </g> </g>","bg":"#1595C8","fg":"#ffffff","width":50,"height":50,"keywords":"graph display output salida grafica","category":["sinks"],"name":{"en-us":"Scope","es-mx":"Scopio"},"desc":{"en-us":"Displays graph","es-mx":"Muestra el gráfico"}}},
    getBlocksForCategories: function () {
        let catForBlocks = {};
        let cList = this.getCategoriesIdList();
        for (let i=0; i< Object.keys(this.blocks).length; i++) {
            let blockID = Object.keys(this.blocks)[i];
            let cats = this.blocks[blockID].category;
            for (let j=0; j<cats.length; j++) {
                if (catForBlocks[cats[j]] === undefined) {
                    catForBlocks[cats[j]] = [];
                }
                catForBlocks[cats[j]].push(blockID);
            }
        }
        /*
        for (let i=0; i<cList.length; i++) {
            catForBlocks[cList[i]] = [];
            for (let j=0; j<(Object.keys(this.blocks)).length; j++) {
                if (this.blocks[Object.keys(this.blocks)[j]].category.indexOf(cList[i])>=0){
                    catForBlocks[cList[i]].push(Object.keys(this.blocks)[j]);
                }
            }
        }*/
        return catForBlocks;
    },
    getCategoriesIdList: function () {
        let list=[];
        for (let i=0; i<this.categories.length; i++) {
            list.push(this.categories[i].id);
        }
        return list;
    }
}
