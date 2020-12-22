import logo from "./logo.svg";
import "./App.css";
import * as THREE from "three";
import {
  Canvas,
  MeshProps,
  useFrame,
  useThree,
  Camera,
  useResource,
  extend
} from "react-three-fiber";
import React, {
  Suspense,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";

import { AmbientLight, Clock, PointLight } from "three";
import useYScroll from "./helper/yscroll";
import useXScroll from "./helper/xscroll";
import { useSpring, config, SpringResumeFn, SpringValue } from "@react-spring/core";

// import Box from "./Box";
import { a } from "@react-spring/three";
import { a as aDom } from "@react-spring/web";
import { useDrag, useWheel ,useGesture} from "react-use-gesture";



function Clip (number:number , min:number, max:number) {
  return Math.max(min, Math.min(number, max));
}

function MyCamera(props:any) {
  //  const [y] = useYScroll([0, 60], { domTarget: window })

  const [{ x, y }, set] = useSpring(() => ({ x: 50, y: 0 }));

  //Camera
  const [spring, setspring] = useSpring(() => ({  position: new THREE.Vector3(60,60,60), config: config.slow }))
  
  
  const bindspring = useGesture({
    // onDrag: ({ offset: [x, y],movement:[mx,my]}) =>{ setspring({ position: [spring.position.get()[0]-(my+mx)/50, 60 , spring.position.get()[2]-(my-mx)/50]})
    onDrag: ({ offset: [x, y],movement:[mx,my]}) =>{ 
      var pos: SpringValue=  spring.position
      var v3 : THREE.Vector3 = pos.get()
      if (v3){
        console.log(v3)
         setspring({ position: new THREE.Vector3(v3.x.valueOf()-(my+mx)/100,60,v3.z.valueOf()-(my-mx)/100)})
      }
  }
  
    // onHover: ({ hovering }) => setspring({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] })
  },{ domTarget: window })

  // Set the drag hook and define component movement based on gesture data

  const bind = useWheel(
    ({ down, movement: [mx, my] }) => {
      if(x){
        const newX = Clip(x.get() - my / 10,20,1000)
        set({ x: newX, y: down ? my : 80 });
      }
      //  set({ x: down ? newX : 60, y: down ? my : 60 })
    },
    { domTarget: window }
  );

  const ref = useRef();
  const test = new THREE.Vector3(20,20,20)
  
  const [position, setPosition] = useState<THREE.Vector3>(test);
  const { setDefaultCamera } = useThree();

  const { camera, gl } = useThree()
  
  useEffect(() => {
    const cam: THREE.Camera =ref.current!
         setDefaultCamera(ref.current!);
        cam.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  }, []);

  useFrame(({ clock, camera }) => {
    if(x){
      if (x.get() == 0) {
        camera.zoom = 80;
      } else {
        camera.zoom = x.get();
      }
    }
   
    camera.updateProjectionMatrix();

    camera.updateMatrixWorld();
    camera.clearViewOffset();
  });

  useFrame(() => {
    //  ref.current.position.z = ( Math.sin(clock.getElapsedTime()/4)) *10
  });

  return( <a.orthographicCamera  {...spring} {...bindspring()} ref={ref} zoom={80}  >
      </a.orthographicCamera>
    );
}

export default function Canva() {
  const c1 = new THREE.Color(0xd8dee9);
  const c2 = new THREE.Color(0xd8dee9);
  var ground=0;
  var nodeh = 1;
  // const [ref, object] = useResource()
//   const { camera, gl } = useThree()

  const points = useMemo(() => [new THREE.Vector3(0, 0.25, 8), new THREE.Vector3(9, 0.25, 8)], [])
  const onUpdate = useCallback(self => self.setFromPoints(points), [points])
 
  return (
    <Canvas
      style={{ height: "100vh", width: "100%",position:"fixed",top:"0px"}}
      pixelRatio={window.devicePixelRatio}
      // colorManagement
      shadowMap
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputEncoding = THREE.sRGBEncoding;
      }}
    >

      <MyCamera></MyCamera>
      {/* <ambientLight></ambientLight> */}
      <directionalLight castShadow intensity={0.2}></directionalLight>
      <hemisphereLight
        color={"white"}
        intensity={0.4}
      ></hemisphereLight>

      {/* <Box color={"#8FBCBB"} position={[-3, 0.25+nodeh, 0]} />
      <Box color={"#8FBCBB"} position={[0, 0.25+nodeh, 0]} />
      <Box color={"#8FBCBB"} position={[3, 0.25+nodeh, 0]} /> */}
      <mesh position={[0, 0.05+nodeh, 0]} receiveShadow>
        {/* <planeGeometry position={[0, 0, 0]} args={[10, 10]} /> */}
        <boxBufferGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial
          // metalness={0.1}
          attach="material"
          color="#3B4252"
        />
      </mesh>

      {/* <Box color={"#8FBCBB"} position={[-3, 1+nodeh, 0]} />
      <Box color={"#8FBCBB"} position={[-3, 1.75+nodeh, 0]} />
      <Box color={"#8FBCBB"} position={[-3, 2.5+nodeh, 0]} />

      <Box color={"#8FBCBB"} position={[-3, 0.25+nodeh, 8]} />
      <Box color={"#8FBCBB"} position={[0, 0.25+nodeh, 8]} />
      <Box color={"#D08770"} position={[3, 0.25+nodeh, 8]} />
      <Box color={"#D08770"} position={[3, 1+nodeh, 8]} /> */}

      <mesh position={[0, 0.05+nodeh, 8]} receiveShadow>
        {/* <planeGeometry position={[0, 0, 0]} args={[10, 10]} /> */}
        <boxBufferGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial
          // metalness={0.1}
          attach="material"
          color="#3B4252"
        />
      </mesh>

      {/* <Box color={"#8FBCBB"} position={[9, 0.25+nodeh, 8]} />
      <Box color={"#8FBCBB"} position={[9, 0.25+nodeh, 5]} />
      <Box color={"#BF616A"} position={[9, 0.25+nodeh, 2]} />
      <Box color={"#BF616A"} position={[9, 1+nodeh, 2]} />
      <Box color={"#BF616A"} position={[9, 0.25+nodeh, -1]} /> */}

      <mesh position={[9, 0.05+nodeh, 4]} receiveShadow>
        {/* <planeGeometry position={[0, 0, 0]} args={[10, 10]} /> */}
        <boxBufferGeometry args={[5, 0.1, 14]} />
        <meshStandardMaterial
          // metalness={0.1}
          attach="material"
          color="#3B4252"
        />
      </mesh>


      <mesh position={[3, nodeh/2, 4]} receiveShadow   >
        {/* <planeGeometry position={[0, 0, 0]} args={[10, 10]} /> */}
        <boxBufferGeometry args={[22, nodeh, 20]} />
        <meshStandardMaterial
          // metalness={0.1}
          attach="material"
          roughness={0}
          color="#4C566A"
          
        />
      </mesh>


      {/* <group position={[0, -2.5, -10]}>
      <line>
         <bufferGeometry attach="geometry" setFromPoints={points} />
         <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={10} linecap={'round'} linejoin={'round'} />
       </line> 
    </group> */}

    {/* <line position={[0, -2.5, -10]}>
        <bufferGeometry attach="geometry" onUpdate={onUpdate} />
        <lineBasicMaterial attach="material" color={'#8FBCBB'}  linewidth={3} linecap={'round'} linejoin={'round'} />
      </line> */}
      {/* <dragControls args={[[object], camera, window]} /> */}

      <gridHelper args={[1000, 1000, c1, c2]} />
    </Canvas>
  );
}
