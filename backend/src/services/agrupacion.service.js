async function createAgrupacion(agrupacion) {
    try {
      // Inserta una nueva agrupacion en la base de datos
      const newAgrupacion = await Agrupacion.create({
        id_agr: agrupacion.id_agr,
        nombre_agr: agrupacion.nombre_agr,
        descripcion: agrupacion.descripcion,
        rut: agrupacion.rut,
        fecha_creacion: agrupacion.fecha_creacion,
        verificado: agrupacion.verificado,
        fecha_verificacion: agrupacion.fecha_verificacion
      });
  
      // Retorna la nueva agrupacion
      return newAgrupacion;
    } catch (error) {
      // Maneja cualquier error que pueda ocurrir
      console.error('Error al insertar la agrupación:', error);
      throw error;
    }
  }