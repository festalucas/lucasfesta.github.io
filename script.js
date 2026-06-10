const SUPABASE_URL =
"https://jvizawmhqlwnonsdztfz.supabase.co";

const SUPABASE_KEY =
"AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXphd21ocWx3bm9uc2R6dGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTk2OTQsImV4cCI6MjA5NjIzNTY5NH0.qAJ4W0mKmOvFMEJxNm6zG4dD2MnuToOXm2QJFKUaTQs";
async function probarConexion(){

    const { data, error } =
    await supabase
        .from("reparaciones")
        .select("*");

    console.log("DATOS:", data);
    console.log("ERROR:", error);
}



const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
probarConexion();
let contadorOT = 1;
let contadorCliente = 1;
let reparaciones = [];
let clientes = [];

function mostrarSeccion(id){

    let secciones = document.querySelectorAll('.seccion');

    secciones.forEach(function(seccion){
        seccion.style.display = 'none';
    });

    document.getElementById(id).style.display = 'block';
    if(id === "economia"){
    actualizarEconomia();
    }
    if(id === "ingreso"){
        actualizarNumeroOT();
    }

    if(id === "clientes"){
        actualizarTablaClientes();
    }

    if(id === "reparaciones"){
        actualizarTablaReparaciones();
    }
}
function actualizarNumeroOT(){

    let numero = "OT-" + String(contadorOT).padStart(6,"0");

    document.getElementById("numeroOrden").innerHTML =
        "<strong>N° Orden:</strong> " + numero;
}
function generarOrden(){

    let numero = "OT-" + String(contadorOT).padStart(6,"0");

    let cliente = document.getElementById("cliente").value;
    let telefono = document.getElementById("telefono").value;
    let direccion = document.getElementById("direccion").value;
    let producto = document.getElementById("producto").value;
    let falla = document.getElementById("falla").value;

    let clienteExistente =
clientes.find(
    c => c.nombre.toLowerCase()
    === cliente.toLowerCase()
);

if(!clienteExistente){

    clienteExistente = {

        id: contadorCliente,
        nombre: cliente,
        telefono: telefono,
        direccion: direccion

    };

    clientes.push(clienteExistente);

    contadorCliente++;

}
    let orden = {
    numero: numero,
    cliente: cliente,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    producto: producto,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    serie: document.getElementById("serie").value,
    falla: falla,
    observaciones: document.getElementById("observaciones").value,
    accesorios: document.getElementById("accesorios").value,
    ubicacion: document.getElementById("ubicacion").value,

    estado: "Ingresado",
    
    fechaIngreso: new Date().toISOString(),
    fechaEntrega: null,

    tecnico: "Lucas",

    valorReparacion: 0,

    gastos: 0,

    transporte: false,

    valorTransporte: 0
};

    reparaciones.push(orden);

    guardarDatos();

    document.getElementById("resultadoOrden").innerHTML = `
        <h3>Orden Generada</h3>
        <p><strong>${numero}</strong></p>
        <p>Cliente: ${cliente}</p>
        <p>Producto: ${producto}</p>
        <p>Estado: Ingresado</p>
    `;


    actualizarTablaReparaciones();

    contadorOT++;

    actualizarNumeroOT();
    document.getElementById("cliente").value = "";
document.getElementById("telefono").value = "";
document.getElementById("direccion").value = "";
document.getElementById("producto").value = "";
document.getElementById("marca").value = "";
document.getElementById("modelo").value = "";
document.getElementById("serie").value = "";
document.getElementById("falla").value = "";
document.getElementById("observaciones").value = "";
document.getElementById("accesorios").value = "";
document.getElementById("ubicacion").value = "";
}
function actualizarTablaReparaciones(){

    let tbody =
        document.querySelector("#tablaReparaciones tbody");

    tbody.innerHTML = "";

    let filtro =
        document.getElementById("filtroEstado")?.value
        || "Todos";
        let busqueda =
(
    document.getElementById(
        "busquedaReparacion"
    )?.value || ""
)
.toLowerCase();

    reparaciones.forEach(function(orden){

        if(
            filtro !== "Todos" &&
            orden.estado !== filtro
        ){
            return;
        }
        if(

    !orden.numero
        .toLowerCase()
        .includes(busqueda)

    &&

    !orden.cliente
        .toLowerCase()
        .includes(busqueda)

    &&

    !orden.producto
        .toLowerCase()
        .includes(busqueda)

){
    return;
}

        tbody.innerHTML += `
            <tr onclick="verDetalle('${orden.numero}')">
                <td>${orden.numero}</td>
                <td>${orden.cliente}</td>
                <td>${orden.producto}</td>
                <td>${orden.estado}</td>
            </tr>
        `;

    });


}
function verDetalle(numeroOrden){

    let orden = reparaciones.find(
        o => o.numero === numeroOrden
    );

    document.getElementById("contenidoDetalle").innerHTML = `

        <h3>${orden.numero}</h3>

        <p><strong>Cliente:</strong> ${orden.cliente}</p>

        <p><strong>Teléfono:</strong> ${orden.telefono}</p>

        <p><strong>Dirección:</strong> ${orden.direccion}</p>

        <hr>

        <p><strong>Fecha ingreso:</strong>
    ${formatearFecha(orden.fechaIngreso || orden.fecha)}
    </p>

    <p><strong>Fecha entrega:</strong>
    ${
        orden.fechaEntrega
        ? formatearFecha(orden.fechaEntrega)
        : "Pendiente"
    }
    </p>
    <p><strong>Días en taller:</strong>
    ${
    orden.fechaEntrega
    ? calcularDias(
        orden.fechaIngreso || orden.fecha,
        orden.fechaEntrega
      ) + " días"
    : "En proceso"
    }
</p>
    <hr> 

        <p><strong>Producto:</strong> ${orden.producto}</p>

        <p><strong>Marca:</strong> ${orden.marca}</p>

        <p><strong>Modelo:</strong> ${orden.modelo}</p>

        <p><strong>Serie:</strong> ${orden.serie}</p>

        <hr>

        <p><strong>Falla:</strong> ${orden.falla}</p>

        <p><strong>Observaciones:</strong> ${orden.observaciones}</p>

        <p><strong>Accesorios:</strong> ${orden.accesorios}</p>

        <p><strong>Ubicación:</strong> ${orden.ubicacion}</p>

        <hr>

        <label>Estado</label>

        <select id="estadoOrden">

            <option ${orden.estado=="Ingresado"?"selected":""}>Ingresado</option>

            <option ${orden.estado=="Diagnosticando"?"selected":""}>Diagnosticando</option>

            <option ${orden.estado=="Esperando aprobación"?"selected":""}>Esperando aprobación</option>

            <option ${orden.estado=="Esperando repuesto"?"selected":""}>Esperando repuesto</option>

            <option ${orden.estado=="En reparación"?"selected":""}>En reparación</option>

            <option ${orden.estado=="Reparado"?"selected":""}>Reparado</option>

            <option ${orden.estado=="Entregado"?"selected":""}>Entregado</option>

        </select>

        <hr>

        <h3>Datos Económicos</h3>

        <label>Técnico Responsable</label>

        <select id="tecnicoOrden">

            <option ${orden.tecnico=="Lucas"?"selected":""}>Lucas</option>

            <option ${orden.tecnico=="Barbi"?"selected":""}>Barbi</option>

            <option ${orden.tecnico=="Christian"?"selected":""}>Christian</option>

        </select>

        <br><br>

        <label>Valor Reparación</label>

        <input
            type="number"
            id="valorReparacion"
            value="${orden.valorReparacion || null}"
        >

        <label>Gastos / Repuestos</label>

        <input
            type="number"
            id="gastos"
            value="${orden.gastos || null}"
        >
        

        <br><br>

        <label>

            <input
                type="checkbox"
                id="transporte"
                ${orden.transporte ? "checked" : ""}
                onchange="mostrarTransporte()"
            >

            Hubo Transporte

        </label>

        <div
            id="divTransporte"
            style="
                margin-top:15px;
                display:${orden.transporte ? "block":"none"};
            "
        >

            <label>Valor Transporte</label>

            <input
                type="number"
                id="valorTransporte"
                value="${orden.valorTransporte || 0}"
            >

        </div>
    <h3>Resumen Económico</h3>

    <p>
        <strong>Ganancia:</strong>
        $${(
            (orden.valorReparacion || 0)
            -
            (orden.gastos || 0)
        )}
    </p>

    <p>
        <strong>Total Cobrado:</strong>
        $${(
            (orden.valorReparacion || 0)
            +
            (orden.valorTransporte || 0)
        )}
    </p>
        <hr>

        <button
            onclick="guardarDetalle('${orden.numero}')"
        >
            Guardar Cambios
        </button>

        <span
    id="guardadoOk"
    style="
        display:none;
        color:green;
        font-weight:bold;
        margin-left:10px;
        font-size:18px;
    "
>
    ✓ Guardado
</span>


    `;

    mostrarSeccion("detalleOrden");
}
function guardarDatos(){

    localStorage.setItem(
        "reparaciones",
        JSON.stringify(reparaciones)
    );

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

}
function cargarDatos(){

    let datosReparaciones =
        localStorage.getItem("reparaciones");

    if(datosReparaciones){

        reparaciones =
            JSON.parse(datosReparaciones);

          reparaciones.forEach(function(orden){

    if(!orden.fecha){

        orden.fecha = new Date().toISOString();

    }

});
        actualizarTablaReparaciones();

        contadorOT = reparaciones.length + 1;
    }

    let datosClientes =
        localStorage.getItem("clientes");

    if(datosClientes){

        clientes = JSON.parse(datosClientes);

        contadorCliente =
            clientes.length + 1;
    }
    actualizarTablaClientes();

}
function cambiarEstado(numeroOrden,nuevoEstado){

    let orden =
        reparaciones.find(
            o => o.numero === numeroOrden
        );

    orden.estado = nuevoEstado;

    guardarDatos();

    actualizarTablaReparaciones();
}
function actualizarTablaClientes(){

    let tbody =
        document.querySelector("#tablaClientes tbody");

    if(!tbody) return;

    tbody.innerHTML = "";

    clientes.forEach(function(cliente){

        tbody.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.telefono}</td>
                <td>
                    <button onclick="infoCliente(${cliente.id})">
                        Info
                    </button>
                </td>
            </tr>
        `;

    });

}
function buscarCliente(){

    let texto =
        document.getElementById("cliente")
        .value
        .toLowerCase();

    let div =
        document.getElementById(
            "sugerenciasCliente"
        );

    div.innerHTML = "";

    if(texto.length < 2){
        return;
    }

    let resultados = clientes.filter(c =>
        c.nombre.toLowerCase()
        .includes(texto)
    );

    resultados.forEach(cliente => {

        div.innerHTML += `
            <div
                class="sugerencia"
                onclick="seleccionarCliente(${cliente.id})"
            >
                ${cliente.nombre}
            </div>
        `;

    });

}
function seleccionarCliente(id){

    let cliente =
        clientes.find(c => c.id == id);

    document.getElementById("cliente").value =
        cliente.nombre;

    document.getElementById("telefono").value =
        cliente.telefono;

    document.getElementById("direccion").value =
        cliente.direccion;

    document.getElementById(
        "sugerenciasCliente"
    ).innerHTML = "";
}
function infoCliente(id){

    let cliente =
        clientes.find(c => c.id == id);

    let historial = reparaciones.filter(
        r => r.cliente.toLowerCase() === cliente.nombre.toLowerCase()
    );

    let historialHTML = "";

    historial.forEach(function(orden){

        historialHTML += `
            <tr>
                <td>${orden.numero}</td>
                <td>${orden.producto}</td>
                <td>${orden.estado}</td>
            </tr>
        `;

    });

    if(historial.length === 0){

        historialHTML = `
            <tr>
                <td colspan="3">
                    Sin reparaciones registradas
                </td>
            </tr>
        `;
    }

    document.getElementById(
        "contenidoCliente"
    ).innerHTML = `

        <label>Nombre</label>
        <input
            type="text"
            id="editarNombre"
            value="${cliente.nombre}"
        >

        <label>Teléfono</label>
        <input
            type="text"
            id="editarTelefono"
            value="${cliente.telefono}"
        >

        <label>Dirección</label>
        <input
            type="text"
            id="editarDireccion"
            value="${cliente.direccion}"
        >

        <hr>

        <h3>Historial de Reparaciones</h3>

        <table>

            <thead>
                <tr>
                    <th>OT</th>
                    <th>Producto</th>
                    <th>Estado</th>
                </tr>
            </thead>

            <tbody>
                ${historialHTML}
            </tbody>

        </table>

        <br>

        <button
            onclick="guardarCliente(${cliente.id})"
        >
            Guardar Cambios
        </button>

    `;

    mostrarSeccion("detalleCliente");
}
function guardarCliente(id){

    let cliente =
        clientes.find(c => c.id == id);

    cliente.nombre =
        document.getElementById(
            "editarNombre"
        ).value;

    cliente.telefono =
        document.getElementById(
            "editarTelefono"
        ).value;

    cliente.direccion =
        document.getElementById(
            "editarDireccion"
        ).value;

    guardarDatos();

    actualizarTablaClientes();

}
cargarDatos();
mostrarSeccion("ingreso");
function exportarDatos(){

    let backup = {

        clientes: clientes,
        reparaciones: reparaciones,
        contadorOT: contadorOT,
        contadorCliente: contadorCliente

    };

    let datos =
        JSON.stringify(backup, null, 2);

    let blob = new Blob(
        [datos],
        {type:"application/json"}
    );

    let enlace =
        document.createElement("a");

    enlace.href =
        URL.createObjectURL(blob);

    enlace.download =
        "backup_tecniquita.json";

    enlace.click();

}
function importarDatos(){

    let archivo =
        document.getElementById(
            "archivoImportacion"
        ).files[0];

    if(!archivo){

        alert(
            "Seleccione un archivo"
        );

        return;
    }

    let lector = new FileReader();

    lector.onload = function(evento){

        let backup =
            JSON.parse(
                evento.target.result
            );

        clientes =
            backup.clientes || [];

        reparaciones =
            backup.reparaciones || [];

        contadorOT =
            backup.contadorOT || 1;

        contadorCliente =
            backup.contadorCliente || 1;

        guardarDatos();

        actualizarTablaClientes();
        actualizarTablaReparaciones();

        alert(
            "Backup restaurado correctamente"
        );

    };

    lector.readAsText(archivo);

}
function mostrarTransporte(){

    let check =
        document.getElementById(
            "transporte"
        );

    let div =
        document.getElementById(
            "divTransporte"
        );

    div.style.display =
        check.checked ? "block" : "none";

}
function guardarDetalle(numeroOrden){

    let orden =
        reparaciones.find(
            o => o.numero === numeroOrden
        );

    let nuevoEstado =
        document.getElementById(
            "estadoOrden"
        ).value;

    if(
        orden.estado !== "Entregado" &&
        nuevoEstado === "Entregado"
    ){
        orden.fechaEntrega =
            new Date().toISOString();
    }

    orden.estado = nuevoEstado;

    orden.tecnico =
        document.getElementById(
            "tecnicoOrden"
        ).value;

    orden.valorReparacion =
        Number(
            document.getElementById(
                "valorReparacion"
            ).value
        );

    orden.gastos =
        Number(
            document.getElementById(
                "gastos"
            ).value
        );

    orden.transporte =
        document.getElementById(
            "transporte"
        ).checked;

    orden.valorTransporte =
        Number(
            document.getElementById(
                "valorTransporte"
            )?.value || 0
        );

   guardarDatos();

actualizarTablaReparaciones();

document.getElementById(
    "guardadoOk"
).style.display = "inline";

setTimeout(function(){

    document.getElementById(
        "guardadoOk"
    ).style.display = "none";

},2000);
}
function actualizarEconomia(){

    let facturacion = 0;
    let gastos = 0;
    let transportes = 0;
    let entregadas = 0;

    reparaciones.forEach(function(orden){

        facturacion +=
            Number(orden.valorReparacion || 0);

        gastos +=
            Number(orden.gastos || 0);

        transportes +=
            Number(orden.valorTransporte || 0);

        if(orden.estado === "Entregado"){
            entregadas++;
        }

    });

    let ganancia =
        facturacion - gastos;

    let ticket =
        entregadas > 0
        ? Math.round(facturacion / entregadas)
        : 0;

        let estados= {
            "Ingresado": 0,
            "Diagnosticando":0,
            "Esperando aprobacion":0,
            "esperando repuesto": 0,
            "en reparación": 0,
            "reparado":0,
            "entregado":0,
        }


reparaciones.forEach(function(orden){

    if(estados[orden.estado] !== undefined){

        estados[orden.estado]++;

    }

});

    document.getElementById(
        "resumenEconomico"
    ).innerHTML = `
        <p><strong>Facturación:</strong> $${facturacion}</p>
        <p><strong>Gastos:</strong> $${gastos}</p>
        <p><strong>Ganancia:</strong> $${ganancia}</p>
        <p><strong>Transportes:</strong> $${transportes}</p>
    `;

    document.getElementById(
        "ticketPromedio"
    ).innerHTML = `
        <p><strong>Ticket Promedio:</strong> $${ticket}</p>
    `;

document.getElementById(
    "resumenEstados"
).innerHTML = `
    <p>Ingresado: ${estados["Ingresado"] || 0}</p>
    <p>Diagnosticando: ${estados["Diagnosticando"] || 0}</p>
    <p>Esperando aprobación: ${estados["Esperando aprobación"] || 0}</p>
    <p>Esperando repuesto: ${estados["Esperando repuesto"] || 0}</p>
    <p>En reparación: ${estados["En reparación"] || 0}</p>
    <p>Reparado: ${estados["Reparado"] || 0}</p>
    <p>Entregado: ${estados["Entregado"] || 0}</p>
    `;

    let meses = {};

reparaciones.forEach(function(orden){

    let fecha = new Date(orden.fecha);

    let clave =
        fecha.getFullYear() + "-" +
        String(fecha.getMonth() + 1)
        .padStart(2,"0");

    if(!meses[clave]){

        meses[clave] = {

            facturacion: 0,
            gastos: 0,
            ordenes: 0

        };

    }

    meses[clave].facturacion +=
        Number(orden.valorReparacion || 0);

    meses[clave].gastos +=
        Number(orden.gastos || 0);

    meses[clave].ordenes++;

});
let htmlMeses = "";

Object.keys(meses)
.sort()
.reverse()
.forEach(function(mes){

    let datos = meses[mes];

    let ganancia =
        datos.facturacion -
        datos.gastos;

    htmlMeses += `

        <div
            style="
                border:1px solid #ccc;
                padding:10px;
                margin-bottom:10px;
                border-radius:8px;
            "
        >

            <strong>${mes}</strong>

            <p>
                Facturación:
                $${datos.facturacion}
            </p>

            <p>
                Gastos:
                $${datos.gastos}
            </p>

            <p>
                Ganancia:
                $${ganancia}
            </p>

            <p>
                Órdenes:
                ${datos.ordenes}
            </p>

        </div>

    `;

});

document.getElementById(
    "desgloseMensual"
).innerHTML = htmlMeses;

}
function formatearFecha(fecha){

    if(!fecha) return "Sin fecha";

    let f = new Date(fecha);

    let meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    return (
        f.getDate() +
        " de " +
        meses[f.getMonth()] +
        " de " +
        f.getFullYear()
    );

}
function calcularDias(fechaInicio, fechaFin){

    if(!fechaInicio || !fechaFin){
        return "-";
    }

    let inicio = new Date(fechaInicio);
    let fin = new Date(fechaFin);

    let diferencia =
        fin - inicio;

    let dias =
        Math.floor(
            diferencia /
            (1000 * 60 * 60 * 24)
        );

    return dias;

}
