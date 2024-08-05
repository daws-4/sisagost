"use client";
import { useEffect, useState } from "react";
import {
  Secondtitle,
  CampoContrato,
  TitleContrato,
  TextContrato,
  CrudDelete,
  CrudUpdate,
} from "../../../components/ui";
import DataTable from "react-data-table-component";
import HeaderNav from "../../../components/static/HeaderNav";
import { toast, ToastContainer } from "react-toastify";
import "../../../../node_modules/react-toastify/dist/ReactToastify.css";
import "../../../../node_modules/react-toastify/dist/react-toastify.esm.mjs";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import React from "react";
import axios from "axios";

export default function Home({ params }: { params: { idd: any } }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showErrorToastMessage, setShowErrorToastMessage] = useState("Error");
  const [showSuccessToastMessage, setShowSuccessToastMessage] =
    useState("Registro exitoso");

  const router = useRouter();

  //estados de la data
  const [data, setData] = useState<any[]>([]);
    const [instaladores, setInstaladores] = useState<any[]>([]);
    const [empresa, setEmpresa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const getUser = async () => {
      const usuario = await axios.get("/api/auth/admin");
      setUser(usuario);
    };
    getUser();
  }, []);

  useEffect(() => {
    const getNow = async () => {
      const horaActual = await axios.get("/api/now");
      setNow(horaActual.data);
    };
    getNow();
  }, []);
  useEffect(() => {
    fetch("/api/contratos")
      .then((res) => res.json())
      .then(setData);
  }, []);
  useEffect(() => {
    fetch("/api/instaladores")
      .then((res) => res.json())
      .then(setInstaladores);
  }, []);
  useEffect(() => {
    fetch("/api/empresas")
      .then((res) => res.json())
      .then(setEmpresa);
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [data]);
  
  
  const records: any[] = [{
    instaladoresActivos: instaladores.filter((instalador) => instalador.empresa == params.idd).length,
}];

  const columns = [
    {
      name: "Instaladores Activos",
      selector: (row: any) => row.instaladoresActivos,
      minWidth: "20",
      center: true,
      cell: (row: any) => {return <p>{row.instaladoresActivos}</p>},
    },
    {
      name: "ID de la ONT",
      selector: (row: any) => row.id,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.id}</p>;
      },
    },
    {
      name: "C.I del cliente",
      selector: (row: any) => row.ci_cliente,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.ci_cliente}</p>;
      },
    },
    {
      name: "Cuenta del Cliente",
      selector: (row: any) => row.id_cuenta,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.id_cuenta}</p>;
      },
    },
    {
      name: "Status del Contrato",
      selector: (row: any) => row.estatus_,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        if (row.estatus_ === 0) {
          return <p>Agendado</p>;
        } else if (row.estatus_ === 1) {
          return <p>Instalado</p>;
        } else if (row.estatus_ === 2) {
          return <p>Finalizado</p>;
        }
      },
    },
    {
      name: "Plan Contratado",
      selector: (row: any) => row.plan_contratado,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.plan_contratado}</p>;
      },
    },
    {
      name: "Teléfono del Cliente",
      selector: (row: any) => row.telefono_cliente,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.telefono_cliente}</p>;
      },
    },
    {
      name: "Nodo",
      selector: (row: any) => row.nodo,
      minWidth: "20",
      center: true,
      cell: (row: any) => {
        return <p>{row.nodo}</p>;
      },
    },
    {
      name: "Fecha de Instalación",
      selector: (row: any) => row.fecha_instalacion,
      minWidth: "20",
      center: true,
      cell: (row: any) => new Date(row.fecha_instalacion).toLocaleDateString(),
    },
  ];

  const title = `Contrato ${params.idd} al día ${now}`;

  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
    } catch (error: any) {
      console.error(error.message);
    }
    router.push("/");
  };

  //pdf
    const date = new Date().toLocaleDateString("es-ES");
    function createStatsPdf(divElement: any){

    const doc = new jsPDF();

    //const
        const fecha_contrato = records[0].fecha_contrato;
        const id = records[0].id;
        const ci_cliente = records[0].ci_cliente;
        const id_cuenta = records[0].id_cuenta;
        const estatus_ = records[0].estatus_;
        const plan_contratado = records[0].plan_contratado;
        const telefono_cliente = records[0].telefono_cliente;
        const nodo = records[0].nodo;
        const fecha_instalacion = records[0].fecha_instalacion;
        const empresa_contratista = records[0].empresa_contratista;
        const contratista_asignado = records[0].contratista_asignado;
        const direccion_contrato = records[0].direccion_contrato;
        const recursos_inventario_instalacion = records[0].recursos_inventario_instalacion;
        const observaciones_instalacion = records[0].observaciones_instalacion;
        const motivo_standby = records[0].motivo_standby;


//texto
    doc.text(title, 60, 10);
    doc.text(`Fecha del Contrato: ${fecha_contrato}`, 30, 20);
    doc.text(`ID de la ONT: ${id}`, 30, 30);
    doc.text(`C.I del cliente: ${ci_cliente}`, 30, 40);
    doc.text(`Cuenta del Cliente: ${id_cuenta}`, 30, 50);
    doc.text(`Status del Contrato: ${estatus_}`, 30, 60);
    doc.text(`Plan Contratado: ${plan_contratado}`, 30, 70);
    doc.text(`Teléfono del Cliente: ${telefono_cliente}`, 30, 80);
    doc.text(`Nodo: ${nodo}`, 30, 90);
    doc.text(`Fecha de Instalación: ${fecha_instalacion}`, 30, 100);
    doc.text(`Empresa Contratista: ${empresa_contratista}`, 30, 110);
    doc.text(`Contratista Asignado: ${contratista_asignado}`, 30, 120);
    doc.text(`Dirección del Contrato: ${direccion_contrato}`, 30, 130);
    doc.text(`Recursos del Inventario: ${recursos_inventario_instalacion}`, 30, 140);
    doc.text(`Observaciones de la Instalación: ${observaciones_instalacion}`, 30, 150);
    doc.text(`Motivo de Standby: ${motivo_standby}`, 30, 160);

    

    doc.save(`contrato-${params.idd}_${date}.pdf`);
  }

  useEffect(() => {
    if (showSuccessToast) {
      toast.success(showSuccessToastMessage, {
        position: "top-center",
        autoClose: 10000,
      });

      setTimeout(() => {
        router.push("/contratos");
      }, 4000);

      setShowSuccessToast(false);
    }

    if (showErrorToast) {
      toast.error(showErrorToastMessage , {
        position: "top-center",
        className: "foo-bar",
        autoClose: false,
      });

      setShowErrorToast(false);
    }
  }, [showSuccessToast, showErrorToast, router]);

  return (
    <div>
      <ToastContainer />
      <HeaderNav>
        <ul>
          <li>
            {user.data ? user.data.nombres : ""}{" "}
            {user.data ? user.data.apellidos : ""}
          </li>
          <li>
            <button onClick={() => logout()}>cerrar sesión</button>
          </li>
        </ul>
      </HeaderNav>
      <div className="md:px-20 px-5 pt-5 z-10">
        <div className="bg-gray-700 md:px-20 px-5 z-10 py-5">
          <DataTable
            title={title}
            columns={columns}
            data={records}
            progressPending={loading}
            noDataComponent={"Loading..."}
            striped
          />
        </div>
      </div>

      <div className="md:px-20 px-5 z-10 mb-10">
        <div className="flex flex-col bg-gray-700 md:px-20 px-5 z-10 py-5">
          <div id='Stats1' className="flex lg:flex-row flex-col">
            <CampoContrato href="/contratos">
              <TitleContrato>Empresa</TitleContrato>
              <TextContrato>
                {records[0]
                  ? records[0].empresa_contratista == 1
                    ? "Servitel"
                    : "Hetelca"
                  : ""}
              </TextContrato>
            </CampoContrato>
            <CampoContrato href="/login">
              <TitleContrato>Instalador</TitleContrato>
              <TextContrato>
                {records[0]
                  ? records[0].contratista_asignado
                    ? records[0].contratista_asignado
                    : ""
                  : ""}
              </TextContrato>
              {/* api de los usuarios */}
            </CampoContrato>
            <CampoContrato href="/login">
              <TitleContrato>Dirección</TitleContrato>
              <TextContrato>
                {records[0] ? records[0].direccion_contrato ?? "" : ""}
              </TextContrato>
            </CampoContrato>
            {records[0] && records[0].estatus_
              ? (
                  <CampoContrato href="/login">
                    <TitleContrato>Material Utilizado</TitleContrato>
                    <TextContrato>
                      {records[0]
                        ? records[0].recursos_inventario_instalacion ?? ""
                        : ""}
                    </TextContrato>
                  </CampoContrato>
                ) ?? ""
              : ""}
            <CampoContrato href="#">
              <TitleContrato>
                {records[0]?.estatus_ ? "Observaciones" : "Motivo de Pausa"}
              </TitleContrato>
              <TextContrato>
                {records[0]?.estatus_
                  ? records[0]?.observaciones_instalacion ?? ""
                  : records[0]?.motivo_stanby ?? ""}
              </TextContrato>
            </CampoContrato>
          </div>
          <div className="flex lg:flex-row flex-col">
            <CrudUpdate>Editar</CrudUpdate>
            {records[0]?.estatus_ == 2 ? (
              ""
            ) : (
              <CrudUpdate >
                Finalizar
              </CrudUpdate>
            )}
            <CrudDelete >Eliminar</CrudDelete>
            <CrudUpdate onClick={(event)=>(createStatsPdf('Stats1'))}>Imprimir</CrudUpdate>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
