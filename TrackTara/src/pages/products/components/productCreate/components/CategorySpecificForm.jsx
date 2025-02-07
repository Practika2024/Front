import { Box, TextField } from "@mui/material";
import React, { memo } from "react";

const CategorySpecificForm = ({ category, onChange }) => {
  const renderFields = (fields) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {fields.map(({ label, name, type }) => (
        <TextField
          key={name}
          label={label}
          name={name}
          type={type || "text"}
          onChange={onChange}
          fullWidth
        />
      ))}
    </Box>
  );

  switch (category) {
    case "Computer case":
      return renderFields([
        { label: "Number of Fans", name: "numberOfFans", type: "number" },
        { label: "Cooling Description", name: "coolingDescription" },
        { label: "Form Factor", name: "formFactor" },
        { label: "Compartment Description", name: "compartmentDescription" },
        { label: "Ports Description", name: "portsDescription" },
      ]);
    case "Processor":
      return renderFields([
        { label: "Model", name: "model" },
        { label: "Cores", name: "cores", type: "number" },
        { label: "Threads", name: "threads", type: "number" },
        { label: "Base Clock", name: "baseClock", type: "number" },
        { label: "Boost Clock", name: "boostClock", type: "number" },
        { label: "Socket", name: "socket" },
      ]);
    case "Graphics Card":
      return renderFields([
        { label: "Model", name: "model" },
        { label: "Memory Size", name: "memorySize", type: "number" },
        { label: "Memory Type", name: "memoryType" },
        { label: "Core Clock", name: "coreClock", type: "number" },
        { label: "Boost Clock", name: "boostClock", type: "number" },
        { label: "Form Factor", name: "formFactor" },
      ]);
    case "Motherboard":
      return renderFields([
        { label: "Socket", name: "socket" },
        { label: "Form Factor", name: "formFactor" },
        { label: "RAM Description", name: "ramDescription" },
        { label: "Network Description", name: "networkDescription" },
        { label: "Power Description", name: "powerDescription" },
        { label: "Audio Description", name: "audioDescription" },
        { label: "External Connectors Description", name: "externalConnectorsDescription" },
      ]);
    case "Power Supply Unit":
      return renderFields([
        { label: "Power Capacity", name: "powerCapacity" },
        { label: "Input Voltage Range", name: "inputVoltageRange" },
        { label: "Fan Type and Size", name: "fanTypeAndSize" },
        { label: "Protections", name: "protections" },
        { label: "Connectors", name: "connectors" },
      ]);
    case "RAM":
      return renderFields([
        { label: "Memory Amount", name: "memoryAmount", type: "number" },
        { label: "Memory Speed", name: "memorySpeed", type: "number" },
        { label: "Memory Type", name: "memoryType" },
        { label: "Form Factor", name: "formFactor" },
        { label: "Voltage", name: "voltage", type: "number" },
        { label: "Memory Bandwidth", name: "memoryBandwidth", type: "number" },
      ]);
    case "Cooler":
      return renderFields([
        { label: "Material", name: "material" },
        { label: "Fan Speed", name: "fanspeed", type: "number" },
        { label: "Fan Amount", name: "fanAmount", type: "number" },
        { label: "Voltage", name: "voltage", type: "number" },
        { label: "Max TDP", name: "maxTDP", type: "number" },
        // { label: "Sockets", name: "sockets" },
        { label: "Fan Supply", name: "fanSupply" },
      ]);
    case "HDD":
      return renderFields([
        { label: "Memory Amount", name: "memoryAmount", type: "number" },
        { label: "Form Factor", name: "formFactor" },
        { label: "Voltage", name: "voltage", type: "number" },
        { label: "Read Speed", name: "readSpeed", type: "number" },
        { label: "Write Speed", name: "writeSpeed", type: "number" },
      ]);
    case "SSD":
      return renderFields([
        { label: "Memory Amount", name: "memoryAmount", type: "number" },
        { label: "Form Factor", name: "formFactor" },
        { label: "Read Speed", name: "readSpeed", type: "number" },
        { label: "Write Speed", name: "writeSpeed", type: "number" },
        { label: "Max TBW", name: "maxTBW", type: "number" },
      ]);
    default:
      return null;
  }
};

export default memo(CategorySpecificForm);
