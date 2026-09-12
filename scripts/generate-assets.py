"""Build original, replaceable SE and render the app's native SVG icon."""
from pathlib import Path
import math, wave
import numpy as np

root=Path(__file__).resolve().parents[1]
rate=44100
presets={'correct':([659,988],.24),'good':([659,831,988],.32),'great':([659,831,988,1319],.38),'excellent':([740,932,1109,1480],.43),'perfect':([659,831,988,1319,1661],.53),'fever':([330,494,659,831,988,1319,1661],.72),'record':([523,659,784,1047,1319,1568],.82),'wrong':([330,277],.20)}
rng=np.random.default_rng(5)
for name,(notes,duration) in presets.items():
 t=np.arange(int(rate*duration))/rate;y=np.zeros_like(t)
 for i,f in enumerate(notes):
  start=i*duration*.38/len(notes);u=np.maximum(t-start,0);mask=t>=start
  env=np.minimum(u/.007,1)*np.exp(-u/(duration*.28))*(np.clip((duration-t)/.04,0,1))
  y+=mask*env*(np.sin(2*np.pi*f*u)+.16*np.sin(2*np.pi*f*2*u))*.24
 if name!='wrong':
  env=np.minimum(t/.008,1)*np.exp(-t/.07);phase=2*np.pi*(64*t+55*.035*(1-np.exp(-t/.035)));y+=np.sin(phase)*env*.43
  y+=rng.standard_normal(len(t))*.022*np.exp(-t/.028)*np.minimum(t/.003,1)
 y*=np.minimum(t/.005,1)*np.clip((duration-t)/.03,0,1)
 y=np.tanh(y*1.6)*.75
 # Stereo width stays subtle and phase coherent.
 stereo=np.column_stack([y,y*.98]);pcm=(np.clip(stereo,-1,1)*32767).astype('<i2')
 with wave.open(str(root/'assets/se'/f'{name}.wav'),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(rate);f.writeframes(pcm.tobytes())
svg=root/'assets/icons/icon.svg'
# PNG icons are rendered with sharp in render-icons.cjs.
