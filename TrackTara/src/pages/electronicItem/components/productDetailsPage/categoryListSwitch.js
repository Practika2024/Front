export const categoryListSwitch = (category) => {
    switch (category) {
      case "Computer case":
        return "case";
      case "Processor":
        return "cpu";
      case "Graphics Card":
        return "gpu";
      case "Motherboard":
        return "motherboard";
      case "Power Supply Unit":
        return "psu";
      case "RAM":
        return "ram";
      case "Cooler":
        return "cooler";
      case "HDD":
        return "hdd";
      case "SSD":
        return "ssd";
      default:
        return null;
    }
  };
  