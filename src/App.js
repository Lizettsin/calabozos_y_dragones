import React, { useState } from 'react';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './App.css';

const roles = {
  ladron: { nombre: "Ladrón", salud: 80, ataque: 15, defensa: 8, icon: "ion-ios-construct" },
  druida: { nombre: "Druida", salud: 100, ataque: 12, defensa: 10, icon: "ion-ios-leaf" },
  guerrero: { nombre: "Guerrero", salud: 120, ataque: 18, defensa: 12, icon: "ion-ios-body" },
  mago: { nombre: "Mago", salud: 90, ataque: 20, defensa: 7, icon: "ion-ios-flask" },
};

function calcularDanio(atacante, defensor) {
  return Math.max(0, atacante.ataque - defensor.defensa);
}

function App() {
  const [rolJugador, setRolJugador] = useState('ladron');
  const [jugador, setJugador] = useState({ ...roles.ladron });
  const [enemigo, setEnemigo] = useState({ nombre: "Goblin", salud: 70, ataque: 14, defensa: 6, icon: "ion-ios-paw" });
  const [log, setLog] = useState([]);
  const [turno, setTurno] = useState(1);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const reiniciarJuego = () => {
    setJugador({ ...roles[rolJugador] });
    setEnemigo({ nombre: "Goblin", salud: 70, ataque: 14, defensa: 6, icon: "ion-ios-paw" });
    setLog([]);
    setTurno(1);
    setJuegoTerminado(false);
  };

  const seleccionarRol = (rol) => {
    setRolJugador(rol);
    setJugador({ ...roles[rol] });
    reiniciarJuego();
  };

  const atacar = () => {
    if (juegoTerminado) return;

    const danioJugador = calcularDanio(jugador, enemigo);
    const nuevaSaludEnemigo = Math.max(0, enemigo.salud - danioJugador);

    let logNuevo = [`Turno ${turno}: ${jugador.nombre} inflige ${danioJugador} de daño a ${enemigo.nombre}.`];
    let nuevaSaludJugador = jugador.salud;
    let logDefensa = "";

    if (nuevaSaludEnemigo > 0) {
      const danioEnemigo = calcularDanio(enemigo, jugador);
      nuevaSaludJugador = Math.max(0, jugador.salud - danioEnemigo);
      logDefensa = `${enemigo.nombre} contraataca con ${danioEnemigo} de daño.`;
      logNuevo.push(logDefensa);
    } else {
      logNuevo.push(`${enemigo.nombre} ha sido derrotado!`);
      setJuegoTerminado(true);
    }

    if (nuevaSaludJugador === 0) {
      logNuevo.push(`${jugador.nombre} ha sido derrotado! Fin del juego.`);
      setJuegoTerminado(true);
    }

    setJugador({ ...jugador, salud: nuevaSaludJugador });
    setEnemigo({ ...enemigo, salud: nuevaSaludEnemigo });
    setTurno(turno + 1);
    setLog([...logNuevo, ...log]);
  };

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="text-center">Calabozos y Dragones - Puzzle Quest</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow className="mb-3 justify-content-center">
            <IonCol size="12" md="6">
              <IonSelect value={rolJugador} placeholder="Selecciona tu rol" onIonChange={e => seleccionarRol(e.detail.value)}>
                {Object.keys(roles).map(rol => (
                  <IonSelectOption key={rol} value={rol}>
                    <i className={`${roles[rol].icon} me-2`}></i>{roles[rol].nombre}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonCol>
          </IonRow>

          <IonRow className="mb-4 justify-content-center">
            <IonCol size="12" md="5">
              <IonCard className="animate__animated animate__fadeInLeft">
                <IonCardHeader>
                  <IonCardTitle><i className={`${jugador.icon} me-2`}></i>{jugador.nombre}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Salud: {jugador.salud}</p>
                  <p>Ataque: {jugador.ataque}</p>
                  <p>Defensa: {jugador.defensa}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" md="5">
              <IonCard className="animate__animated animate__fadeInRight">
                <IonCardHeader>
                  <IonCardTitle><i className={`${enemigo.icon} me-2`}></i>{enemigo.nombre}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Salud: {enemigo.salud}</p>
                  <p>Ataque: {enemigo.ataque}</p>
                  <p>Defensa: {enemigo.defensa}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow className="mb-3 justify-content-center">
            <IonCol size="auto">
              <IonButton color="success" onClick={atacar} disabled={juegoTerminado || jugador.salud === 0 || enemigo.salud === 0}>
                Atacar
              </IonButton>
            </IonCol>
            <IonCol size="auto">
              <IonButton color="medium" onClick={reiniciarJuego}>
                Reiniciar
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <h5>Historial de combate:</h5>
              <ul className="list-group animate__animated animate__fadeInUp">
                {log.map((evento, idx) => (
                  <li key={idx} className="list-group-item">{evento}</li>
                ))}
              </ul>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonApp>
  );
}

export default App;