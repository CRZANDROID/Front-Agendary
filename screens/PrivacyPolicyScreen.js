import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Políticas de Privacidad</Text>
        <Text style={styles.text}>
          Monrajas Ruiz Darinel, con domicilio en Av. Tercera nte pte No. 1190 Col. Centro Centro C.P. 29150 Suchiapa, Chiapas. Hace de su conocimiento que los datos personales de usted, que actualmente o en el futuro obren en nuestra base de datos, ya sea por formar parte de nuestro grupo de clientes o ser alguno de nuestros proveedores, serán tratados y/o utilizados por: Monrajas Ruiz Darinel, con el propósito de cumplir aquellas obligaciones que se derivan de la relación jurídica existente entre usted como titular de los datos personales y las empresa antes señalada.
        </Text>
        <Text style={styles.text}>
          Monrajas Ruiz Darinel en los casos de excepción previsto en el artículo 37 de la Ley Federal de Protección de Datos Personales en Posesión de Particulares y en los artículos 18 fracción V, 21,22,23 y 24 de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita, podrá transferir sus datos personales, toda vez que los productos que Monrajas Ruiz Darinel comercializa son considerados por esta Ley, como actividades vulnerables y por tanto sujetas a dicha normatividad.
        </Text>
        <Text style={styles.text}>
          Los datos que almacenamos en nuestra base de datos serán tratados de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento, y la información está garantizada y protegida por medidas de seguridad administrativas, técnicas y físicas, para evitar su daño, pérdida, alteración, destrucción, uso, acceso o divulgación indebida. Para conocer dichos procedimientos se puede poner en contacto con nosotros element@gmail.com y 9681250192.
        </Text>
        <Text style={styles.text}>
          Su información será utilizada para proporcionarle un mejor servicio y, en particular por las siguientes razones:
        </Text>
        <Text style={styles.text}>
          • Mantenimiento de registros internos y alta de clientes.
        </Text>
        <Text style={styles.text}>
          • Para mejorar nuestros productos y servicios,
        </Text>
        <Text style={styles.text}>
          • Para comunicarnos con usted por correo electrónico, teléfono si nos ha hecho pedidos o comprado productos, sea acerca del pedido o la compra u otros asuntos relacionados con transacciones entre nosotros o su relación como cliente nuestro.
        </Text>
        <Text style={styles.text}>
          • Atender quejas y aclaraciones, y en su caso, tratarlos para fines compatibles con los mencionados en este Aviso de Privacidad y que se consideren análogos para efectos legales. En caso de formalizar con Usted la aceptación de algún producto o servicio ofrecido. Sus datos serán utilizados para el cumplimiento de las obligaciones derivadas de esa relación jurídica.
        </Text>
        <Text style={styles.text}>
          • Para proporcionar referencias comerciales.
        </Text>
        <Text style={styles.text}>
          • Cuando usted solicite un crédito o financiamiento.
        </Text>
        <Text style={styles.text}>
          Para las finalidades antes mencionadas, requerimos obtener los siguientes datos personales: Nombre Completo, empresa en la que labora, cargo que ocupa, correo electrónico, números telefónicos, Registro Federal de Contribuyentes, Domicilio fiscal y personal, para procesar su solicitud de crédito o financiamiento se le puede pedir referencias personales y comerciales.
        </Text>
        <Text style={styles.text}>
          No divulgaremos su información personal a terceros para sus propios propósitos de marketing.
        </Text>
        <Text style={styles.text}>
          Por otra parte, hacemos de su conocimiento que en cualquier momento podrá ejercer los derechos de acceso, rectificación, cancelación u oposición al tratamiento de sus Datos, presentando su solicitud a través del correo electrónico: element@gmail.com debiendo recabar el acuse de recibo correspondiente. Todas las solicitudes que sean presentadas a Monrajas Ruiz Darinel, independiente del medio utilizado por los titulares, deberán:
        </Text>
        <Text style={styles.text}>
          • Incluir el nombre y firma autógrafa del titular, así como un domicilio u otro medio para comunicarle la respuesta a su solicitud.
        </Text>
        <Text style={styles.text}>
          • Acompañar los documentos oficiales que acrediten la identidad de titular.
        </Text>
        <Text style={styles.text}>
          • Incluir una descripción clara y precisa de los datos personales respecto de los cuales ejercitará los derechos que les confiere la Ley.
        </Text>
        <Text style={styles.text}>
          • Incluir cualquier elemento o documento que facilite la localización de los datos personales de que se traten.
        </Text>
        <Text style={styles.text}>
          Se entenderá que usted como titular consiente tácitamente el tratamiento de sus datos personales conforme a lo enunciado en el presente aviso de privacidad, cuando habiéndolo puesto a su disposición, no manifieste su oposición. Monrajas Ruiz Darinel se reserva el derecho de cambiar, modificar, complementar y/o alterar el presente Aviso, en cualquier momento, en cuyo caso se hará de su conocimiento a través de cualquiera de los medios que establece la legislación en la materia.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default PrivacyPolicyScreen;
