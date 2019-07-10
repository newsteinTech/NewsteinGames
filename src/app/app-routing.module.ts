import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { GameSetupComponent } from './components/setup/game-setup.component';
import { ChickenGameComponent } from './components/chicken-game/chicken-game.component';
import { BalloonGameComponent } from './components/balloon-game/balloon-game.component';
import { CircularMotionParticlesComponent } from './components/circular-motion-particles/circular-motion-particles.component';
import { RandomBallsComponent } from './components/random-balls/random-balls.component';
import { BubblesCollisionComponent } from './components/bubbles-collision/bubbles-collision.component';
import { BubbleFadeComponent } from './components/bubble-fade/bubble-fade.component';
import { MatrixRainComponent } from './components/matrix-rain/matrix-rain.component';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';
import { AngryBirdComponent } from './components/angry-bird/angry-bird.component';

const routes: Routes = [
  { path: "", component: GameSetupComponent },
  { path: 'snakegame', component: GameComponent },
  { path: 'chickengame', component: ChickenGameComponent},
  { path: 'balloonGame', component: BalloonGameComponent},
  { path: 'circularParticle', component: CircularMotionParticlesComponent},
  { path: 'randomBalls', component: RandomBallsComponent},
  { path: 'randomBubble', component: BubblesCollisionComponent},
  { path: 'bubbleFade', component: BubbleFadeComponent},
  { path: 'matrixRain', component:MatrixRainComponent},
  { path: 'gunBulletGame', redirectTo: 'balloonGame'},
  { path: 'angryBird', component: AngryBirdComponent},

  { path: '**', component: NoPageFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
