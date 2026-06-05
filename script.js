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

    reparaciones.forEach(function(orden){

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
                        In
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

    alert("Cliente actualizado");
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

    orden.estado =
        document.getElementById(
            "estadoOrden"
        ).value;

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
