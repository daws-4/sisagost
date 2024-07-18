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
import React from "react";
import axios from "axios";

export default function Home({ params }: { params: { id: any } }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const router = useRouter();

  //estados de la data
  const [data, setData] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([
    {
      ci_cliente: "",
      contratista_asignado: "",
      direccion_contrato: "",
      empresa_contratista: "0",
      estatus_: "",
      fecha_contrato: "",
      fecha_instalacion: "",
      id: "",
      id_cuenta: "",
      motivo_standby: "",
      nodo: "",
      observaciones_instalacion: "",
      plan_contratado: "",
      recursos_inventario_instalacion: "",
      telefono_cliente: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});

  const finishContrat = async (event: any) => {
    const confirmFinish = window.confirm(
      "¿Estás seguro que deseas FINALIZAR este contrato?"
    );
    if (confirmFinish) {
      try {
        const finished = await axios.get(`/contratos/${params.id}/finish`);
        console.log(finished);
        if (finished.status === 200) {
          setShowSuccessToast(true);
          setTimeout(() => {
           window.location.reload();
          }, 4000);
        }
      } catch (error: any) {
        if (error.deleted && error.deleted.status === 401) {
          setShowErrorToast(true);
        }
      }
    }
  };


  const deleteContrat = async (event: any) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro que deseas ELIMINAR este contrato?"
    );
    if (confirmDelete) {
      try {
        const deleted = await axios.get(`/contratos/${params.id}/delete`);
        console.log(deleted);
        if (deleted.status === 200) {
          setShowSuccessToast(true);
        }
      } catch (error: any) {
        if (error.deleted && error.deleted.status === 401) {
          setShowErrorToast(true);
        }
      }
    }
  };

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
    const getData = async () => {
      const contratData = await axios.get(`/api/contratos/${params.id}`);
      setData(contratData.data);
    };
    getData();
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecords(data);
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [data]);

  const columns = [
    {
      name: "Fecha del Contrato",
      selector: (row: any) => row.fecha_contrato,
      minWidth: "20",
      center: true,
      cell: (row: any) => new Date(row.fecha_contrato).toLocaleDateString(),
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

  const title = `Contrato ${params.id} al día ${now}`;

  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
    } catch (error: any) {
      console.error(error.message);
    }
    router.push("/");
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success("Registro Eliminado!", {
        position: "top-center",
        autoClose: 10000,
      });

      setTimeout(() => {
        router.push("/contratos");
      }, 4000);

      setShowSuccessToast(false);
    }

    if (showErrorToast) {
      toast.error("Error", {
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
          <div className="flex lg:flex-row flex-col">
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
            <CrudUpdate href={`${params.id}/edit`}>Editar</CrudUpdate>
            {records[0]?.estatus_ == 2 ? (
              ""
            ) : (
              <CrudUpdate onClick={() => finishContrat("")}>
                Finalizar
              </CrudUpdate>
            )}
            <CrudDelete onClick={() => deleteContrat("")}>Eliminar</CrudDelete>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
