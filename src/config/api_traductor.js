import axios from 'axios'

const translateController = (req, res)=>{
    //se destructura los datos traidos del frontend
    const {text} = req.body

    console.log(req);
    console.log(text);
    
    const URL = process.env.APILINKLANGUAGE
    const authKey = process.env.APIKEYLANGUAGE

    //se pasan los parametros que pide la pagina para su funcionamiento y los sensibles como key 
    //y enlace de la api nos lo guardamos en el env >:)

    //objetos de configuracion... esto deberia ir en otro archivo xd
    const config = {
        headers:{
            'content-type': 'application/json',
            'Authorization': `DeepL-Auth-Key ${authKey}`, 
        }
    };

    //objeto dinamico traido directamente del front B)
    const data= {
        text,
        "source_lang":'es',
        "target_lang":'en'
    }

    //literal esta mamada es la que traduce lo demas es configuracion
    axios.post(URL ,data, config)
    .then(response=>{
        console.log("respuesta de la api: ", response.data);
        res.json(response.data);
    })
    //manejo de errores
    .catch(error => {
        console.log("el error definitivamente esta aca en la peticion");
        console.error(error);
        res.status(500).json({error: 'error en la traduccion'});
    })
}

export default translateController