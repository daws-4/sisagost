'use client'
import { useEffect, useState } from "react";
import {Secondtitle, InputFilter, SelectFilter, LabelFilter, LabelButton} from '../../components/ui'
import DataTable from 'react-data-table-component'

 import React from "react";


export default function Home() {

  const [filterId, setFilterId] = useState("");
  const [filterContratista, setFilterContratista] = useState("");
  const [data, setData] = useState<any[]>([]); 
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const timeout = setTimeout(() => {
       setRecords(data);
       setLoading(false)
    }, 3000)
   return () => clearTimeout(timeout);
  }, [data]);

   function idFilter () {
    console.log(filterId, filterContratista)
    const filteredRecords = data.filter(record => {
    return (
      String(record.id).includes(filterId) ||
      String(record.contratista_asignado).includes(filterContratista)
    );})
    
    setRecords(filteredRecords);
    console.log(filteredRecords);
  }

    // const instaladorFilter = (e: any) => {
    // const filteredRecords = data.filter((record) => {
    // return String(record.contratista_asignado).includes(e.target.value);});
    // setRecords(filteredRecords);
    // console.log(filteredRecords)
    // };


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
    },
    {
      name: "Empresa Asignada",
      selector: (row: any) => row.empresa_contratista,
      sortable: true,
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


 

  return (
    <div>
      <div>
        <Secondtitle>Bienvenido</Secondtitle>
      </div>

      <div className="md:px-20 px-5 z-10">
        <form className=" bg-gray-700 md:px-20 px-5 z-10 pt-5">
          <LabelFilter htmlFor="fecha_desde">Desde</LabelFilter>
          <InputFilter type="date" id="fecha_desde" name="fecha_desde" />
          <LabelFilter htmlFor="fecha_hasta">Hasta</LabelFilter>
          <InputFilter type="date" id="fecha_hasta" name="fecha_hasta" />
          <InputFilter
            type="text"
            name="id"
            placeholder="ID de la ONT"
            onChange={(event) => setFilterId(event.target.value) }
          />
          <SelectFilter name="estatus_">
            <option defaultValue={""}>Status</option>
            <option value="0">Agendado</option>
            <option value="1">Instalado</option>
            <option value="2">Finalizado</option>
          </SelectFilter>
          <SelectFilter name="empresa_contratista">
            <option defaultValue={""}>Empresa</option>
            <option value="0">Hetelca</option>
            <option value="1">Servitel</option>
          </SelectFilter>
          <InputFilter
            type="text"
            name="contratista_asignado"
            placeholder="Instalador Asignado"
            onChange={(event) => setFilterContratista(event.target.value)}
          />
          <InputFilter
            type="text"
            name="ci_cliente"
            placeholder="Cédula del Cliente"
          />
          <LabelFilter htmlFor="fecha_instalacion">Instalado en</LabelFilter>
          <InputFilter
            type="date"
            name="fecha_instalacion"
            placeholder="Fecha de Instalación"
            id="fecha_instalacion"
          />
          <InputFilter type="text" name="nodo" placeholder="Nodo" />
          <LabelButton onClick={idFilter}>buscar</LabelButton>
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


