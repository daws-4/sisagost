"use client";
import { useEffect, useState } from "react";
import {
  Secondtitle,
  InputFilter,
  SelectFilter,
  LabelFilter,
  LabelButton,
} from "../../components/ui";
import DataTable from "react-data-table-component";

import React from "react";

export default function Home() {
  //estados de los filtros

  const [filterId, setFilterId] = useState("");
  const [filterContratista, setFilterContratista] = useState("");
  const [filterDesde, setFilterDesde] = useState("");
  const [filterHasta, setFilterHasta] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("");
  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterCi, setFilterCi] = useState("");
  const [filterFechaInstalacion, setFilterFechaInstalacion] = useState("");
  const [filterNodo, setFilterNodo] = useState("");

  //estados de la data
  const [data, setData] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const desdeDate = new Date(filterDesde);
  const hastaDate = new Date(filterHasta);
  const desdeSiempre = new Date("01/01/1970");
  const hastaSiempre = new Date("01/01/2100");

  function idFilter() {
    const filteredRecords = data.filter((record) => {
      const recordDate = new Date(record.fecha_contrato);

      if (filterDesde == "" || filterHasta == "") {
        return (
          recordDate >= desdeSiempre &&
          recordDate <= hastaSiempre &&
          String(record.id).includes(filterId) &&
          String(record.contratista_asignado).includes(filterContratista) &&
          String(record.estatus_).includes(filterEstatus) &&
          String(record.empresa_contratista).includes(filterEmpresa) &&
          String(record.ci_cliente).includes(filterCi) &&
          String(record.fecha_instalacion)
            .toLocaleLowerCase()
            .includes(filterFechaInstalacion) &&
          String(record.nodo).toLocaleLowerCase().includes(filterNodo)
        );
      } else {
        return (
          String(record.id).includes(filterId) &&
          String(record.contratista_asignado).includes(filterContratista) &&
          recordDate >= desdeDate &&
          recordDate <= hastaDate &&
          String(record.estatus_).includes(filterEstatus) &&
          String(record.empresa_contratista).includes(filterEmpresa) &&
          String(record.ci_cliente).includes(filterCi) &&
          String(record.fecha_instalacion)
            .toLocaleLowerCase()
            .includes(filterFechaInstalacion.toLocaleLowerCase()) &&
          String(record.nodo).toLocaleLowerCase().includes(filterNodo.toLowerCase())
        );
      }
    });
    console.log(
      filterId,
      filterContratista,
      desdeDate,
      hastaDate,
      filterEstatus,
      filterEmpresa,
      filterCi,
      filterFechaInstalacion,
      filterNodo
    );
    setRecords(filteredRecords);
    console.log(filteredRecords);
  }

  //estados de los formularios
  const [id, setId] = useState<any[]>();
  const [contratista, setContratista] = useState<any[]>();
  const [desde, setDesde] = useState<any[]>();
  const [hasta, setHasta] = useState<any[]>();
  const [estatus, setEstatus] = useState<any[]>();
  const [empresa, setEmpresa] = useState<any[]>();
  const [ci, setCi] = useState<any[]>();
  const [fechaInstalacion, setFechaInstalacion] = useState<any[]>();
  const [nodo, setNodo] = useState<any[]>();

  function formReset() {
    setId([]);
    setFilterId("");
    setContratista([]);
    setFilterContratista("");
    setDesde([]);
    setFilterDesde("");
    setHasta([]);
    setFilterHasta("");
    setEstatus([]);
    setFilterEstatus("");
    setEmpresa([]);
    setFilterEmpresa("");
    setCi([]);
    setFilterCi("");
    setFechaInstalacion([]);
    setFilterFechaInstalacion("");
    setNodo([]);
    setFilterNodo("");
  }

  function formReset2() {
    setId(undefined);
    setContratista(undefined);
    setDesde(undefined);
    setHasta(undefined);
    setEstatus(undefined);
    setEmpresa(undefined);
    setCi(undefined);
    setFechaInstalacion(undefined);
    setNodo(undefined);
  }

  const columns = [
    {
      name: "Fecha del Contrato",
      selector: (row: any) => row.fecha_contrato,
      sortable: true,
      format: (row: any) => new Date(row.fecha_contrato).toLocaleDateString(),
    },
    {
      name: "ID de la ONT",
      selector: (row: any) => row.id,
      sortable: true,
    },
    {
      name: "Status del Contrato",
      selector: (row: any) => row.estatus_,
      sortable: true,
      cell: (row: any) => {
        if (row.estatus_ === 0) {
          return "Agendado";
        } else if (row.estatus_ === 1) {
          return "Instalado";
        } else if (row.estatus_ === 2) {
          return "Finalizado";
        }
      },
    },
    {
      name: "Empresa Asignada",
      selector: (row: any) => row.empresa_contratista,
      sortable: true,
      cell: (row: any) => {
        if (row.empresa_contratista) {
          return "Servitel";
        } else {
          return "Hetelca";
        }
      },
    },
    {
      name: "Instalador Asignado",
      selector: (row: any) => row.contratista_asignado,
      sortable: true,
    },
  ];

   const estadisticColumns = [
     {
       name: "Fecha del Contrato",
       selector: (row: any) => row.fecha_contrato,
       sortable: true,
       format: (row: any) => new Date(row.fecha_contrato).toLocaleDateString(),
     },
     {
       name: "ID de la ONT",
       selector: (row: any) => row.id,
       sortable: true,
     },
     {
       name: "Status del Contrato",
       selector: (row: any) => row.estatus_,
       sortable: true,
       cell: (row: any) => {
         if (row.estatus_ === 0) {
           return "Agendado";
         } else if (row.estatus_ === 1) {
           return "Instalado";
         } else if (row.estatus_ === 2) {
           return "Finalizado";
         }
       },
     },
     {
       name: "Empresa Asignada",
       selector: (row: any) => row.empresa_contratista,
       sortable: true,
       cell: (row: any) => {
         if (row.empresa_contratista) {
           return "Servitel";
         } else {
           return "Hetelca";
         }
       },
     },
     {
       name: "Instalador Asignado",
       selector: (row: any) => row.contratista_asignado,
       sortable: true,
     },
   ];

  useEffect(() => {
    fetch("/api/contratos")
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

  return (
    <div>
      <div>
        <Secondtitle>Bienvenido</Secondtitle>
      </div>

      <div className="md:px-20 px-5 z-10 mb-10">
        <div className='bg-gray-700 md:px-20 px-5 z-10 pt-5'>
          <DataTable
            data={[]}
            columns={estadisticColumns}
          />
        </div>
      </div>

      <div className="md:px-20 px-5 z-10">
        <form className=" bg-gray-700 md:px-20 px-5 z-10 pt-5" id="contratForm">
          <LabelFilter htmlFor="fecha_desde">Desde</LabelFilter>
          <InputFilter
            type="date"
            id="fecha_desde"
            name="fecha_desde"
            value={desde}
            onClick={formReset2}
            onChange={(event) => setFilterDesde(event.target.value)}
          />
          <LabelFilter htmlFor="fecha_hasta">Hasta</LabelFilter>
          <InputFilter
            type="date"
            id="fecha_hasta"
            name="fecha_hasta"
            value={hasta}
            onClick={formReset2}
            onChange={(event) => setFilterHasta(event.target.value)}
          />
          <InputFilter
            type="text"
            name="id"
            placeholder="ID de la ONT"
            value={id}
            onClick={formReset2}
            onChange={(event) => setFilterId(event.target.value)}
          />
          <SelectFilter
            name="estatus_"
            value={estatus}
            onClick={formReset2}
            onChange={(event) => setFilterEstatus(event.target.value)}
          >
            <option defaultValue={[]}>Status</option>
            <option value="0">Agendado</option>
            <option value="1">Instalado</option>
            <option value="2">Finalizado</option>
          </SelectFilter>
          <SelectFilter
            name="empresa_contratista"
            value={empresa}
            onClick={formReset2}
            onChange={(event) => setFilterEmpresa(event.target.value)}
          >
            <option defaultValue={[]}>Empresa</option>
            <option value="0">Hetelca</option>
            <option value="1">Servitel</option>
          </SelectFilter>
          <InputFilter
            type="text"
            name="contratista_asignado"
            placeholder="Instalador Asignado"
            value={contratista}
            onClick={formReset2}
            onChange={(event) => setFilterContratista(event.target.value)}
          />
          <InputFilter
            type="text"
            name="ci_cliente"
            placeholder="Cédula del Cliente"
            value={ci}
            onClick={formReset2}
            onChange={(event) => setFilterCi(event.target.value)}
          />
          <LabelFilter htmlFor="fecha_instalacion">Instalado en</LabelFilter>
          <InputFilter
            type="date"
            name="fecha_instalacion"
            placeholder="Fecha de Instalación"
            id="fecha_instalacion"
            value={fechaInstalacion}
            onClick={formReset2}
            onChange={(event) => setFilterFechaInstalacion(event.target.value)}
          />
          <InputFilter
            type="text"
            name="nodo"
            placeholder="Nodo"
            value={nodo}
            onClick={formReset2}
            onChange={(event) => setFilterNodo(event.target.value)}
          />
          <LabelButton onClick={idFilter}>buscar</LabelButton>
          <LabelButton onClick={formReset}>Limpiar</LabelButton>
        </form>
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
