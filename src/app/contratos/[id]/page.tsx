"use client";
import { useEffect, useState } from "react";
import {
  Secondtitle,
} from "../../../components/ui";
import DataTable from "react-data-table-component";
import HeaderNav from "../../../components/static/HeaderNav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import axios from 'axios'



export default function Home({ params }: { params: { id: any } }) {
  console.log(params.id);

  const router = useRouter();

  //estados de la data
  const [data, setData] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});

  console.log(user.data, now);
  useEffect(() => {
    const getUser = async () => {
      const usuario = await axios.get("/api/auth/admin");
      setUser(usuario);
      console.log(usuario.data.nombres);
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
    fetch(`/api/contratos/${params.id}`)
      .then((res) => res.json())
      .then(setData);
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
      sortable: true,
      cell: (row: any) => (
        <Link href="">
          {" "}
          {new Date(row.fecha_contrato).toLocaleDateString()}
        </Link>
      ),
    },
    {
      name: "ID de la ONT",
      selector: (row: any) => row.id,
      sortable: true,
      cell: (row: any) => {
        return <Link href="">{row.id}</Link>;
      },
    },
    {
      name: "Status del Contrato",
      selector: (row: any) => row.estatus_,
      sortable: true,
      cell: (row: any) => {
        if (row.estatus_ === 0) {
          return <Link href="">Agendado</Link>;
        } else if (row.estatus_ === 1) {
          return <Link href="">Instalado</Link>;
        } else if (row.estatus_ === 2) {
          return <Link href="">Finalizado</Link>;
        }
      },
    },
    {
      name: "Empresa Asignada",
      selector: (row: any) => row.empresa_contratista,
      sortable: true,
      cell: (row: any) => {
        if (row.empresa_contratista) {
          return <Link href="">Servitel</Link>;
        } else {
          return <Link href="">Hetelca</Link>;
        }
      },
    },
    {
      name: "Instalador Asignado",
      selector: (row: any) => row.contratista_asignado,
      sortable: true,
      cell: (row: any) => {
        return <Link href="">{row.contratista_asignado}</Link>;
      },
    },
  ];

  const estadisticData: any[] = [
    {
      activo: data.filter((record) => record.estatus_ < 2).length,
      instalado: data.filter((record) => record.estatus_ === 1).length,
      finalizado: data.filter((record) => record.estatus_ === 2).length,
      agendado: data.filter((record) => record.estatus_ === 0).length,
    },
  ];

  const estadisticColumns = [
    {
      name: "Contratos Activos",
      selector: (row: any) => row.activo,
    },
    {
      name: "Contratos Agendados",
      selector: (row: any) => row.agendado,
    },
    {
      name: "Contratos Instalados",
      selector: (row: any) => row.instalado,
    },
    {
      name: "Contratos Finalizados",
      selector: (row: any) => row.finalizado,
    },
  ];
  const title = `Contratos ${now}`;

  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      console.log(res);
    } catch (error: any) {
      console.error(error.message);
    }
    router.push("/");
  };

  return (
    <div>
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
      <div>
        <Secondtitle>
          Bienvenido {user.data ? user.data.nombres : ""}
        </Secondtitle>
      </div>

      <div className="md:px-20 px-5 z-10 mb-10">
        <div className="bg-gray-700 md:px-20 px-5 z-10 py-5">
          <DataTable
            title={title}
            data={estadisticData}
            columns={estadisticColumns}
            progressPending={loading}
            noDataComponent={"Loading..."}
            striped
          />
        </div>
      </div>

      <div className=" md:px-20 px-5 z-10 ">
        <DataTable
          title="Contratos"
          columns={columns}
          data={records}
          selectableRows
          pagination
          fixedHeader
          progressPending={loading}
          noDataComponent={"Loading..."}
          striped
          selectableRowsHighlight
          selectableRowsNoSelectAll
          paginationPerPage={20}
          onSelectedRowsChange={(data) => console.log(data)}
        />
      </div>
    </div>
  );
}
