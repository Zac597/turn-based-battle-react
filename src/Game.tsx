import { useEffect, useState } from "react"

type Player ={
  hp: number,
  stamina: number,
  isDefending: boolean,
}

type Enemy = {
  hp: number,
}

type Turn = 'player' | 'enemy'


export default function Game() {
  const [player, setPlayer] = useState<Player>({
    hp: 10,
    stamina: 5,
    isDefending: false
  })

  const [enemy, setEnemy] = useState<Enemy>({
    hp: 10
  })

  const [turn, setTurn] = useState<Turn>('player')

  const gameOver = player.hp <= 0 || enemy.hp <= 0

  function playerAttack(damage: number, staminaCost: number){
    if (player.stamina < staminaCost || turn !== 'player' || gameOver) return

    setEnemy(e => ({ ...e, hp: e.hp - damage}))
    setPlayer(p => ({
      ...p,
      stamina: p.stamina - staminaCost,
      isDefending: false
    }))
    setTurn('enemy')
  }

  function playerDefend() {
    if(turn !== 'player' || gameOver) return
    
    setPlayer(p => ({
      ...p,
      stamina: p.stamina + 1,
      isDefending: true
    }))
    setTurn('enemy')
  }

  useEffect(() => {
    if (turn !== 'enemy' || gameOver) return

    const damage = player.isDefending ? 1 : 2


    const timer = setTimeout(() => {
      setPlayer(p => ({
        ...p,
        hp: p.hp - damage,
        isDefending: false
      }))
    setTurn('player')
    }, 500)

    return () => clearTimeout(timer)
  }, [turn, gameOver, player.isDefending])

return (
  <div>
    <h1>Turn-based Game</h1>

    <p><strong>Turno:</strong>{turn}</p>

    <h2>Player</h2>
    <p>HP: {player.hp}</p>
    <p>Stamina: {player.stamina}</p>
    <p>Defendendo: {player.isDefending ?'sim' : 'não'}</p>

    <h2>Enemy</h2>
    <p>HP: {enemy.hp}</p>

    {gameOver && (
      <h2>
        {player.hp <= 0 ? 'Você perdeu' : 'Você venceu'}
      </h2>
    )}
    {!gameOver && turn === 'player' && (
      <div>
        <button onClick={() => playerAttack(1, 1)}>
          Ataque fraco (-1 stamina)
        </button>

        <button onClick={() => playerAttack(3, 2)}>
          Ataque forte (-2 stamina)
        </button>

        <button onClick={playerDefend}>
          Defender (+1 stamina)
        </button>
      </div>
    )}
  </div>
)

}