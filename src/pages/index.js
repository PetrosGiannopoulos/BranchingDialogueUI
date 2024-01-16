import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter, Jolly_Lodger } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useState, useRef, useCallback, useStore, memo, forwardRef } from 'react'
import { useEffect} from 'react'
import fs from 'fs-extra'
import axios from 'axios'
import { useRouter } from 'next/router'
import OutsideClickHandler from 'react-outside-click-handler';
import 'reactflow/dist/style.css';
import ReactFlow, { Background, Controls, Handle, Position, 
  useNodesState, useEdgesState,addEdge,ReactFlowProvider,
  useReactFlow,useUpdateNodeInternals, useStoreApi,Viewport,getBezierPath,MarkerType } from 'reactflow';

import { NodeResizer, NodeResizeControl } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { data } from 'autoprefixer'

const inter = Inter({ subsets: ['latin'] })


export default function Home() {


  const [addModal, setAddModal] = useState(false)
  const [numberOptions, setNumberOptions] = useState(0)
  
  const [theme, setTheme] = useState("theme-light2");
  let reactFlowInstance;

  const dialogueDataRefs = {
    id: useRef(1),
    numberOptions: useRef(0),
    dialogue : useRef({}),
    dialogues: useRef({}),
    addModal: useRef(false),
    initialized: useRef(false),
    nodeData_: useRef({}),
    edgeData_: useRef({}),
    selectedNode: useRef('-1'),
    editedNode: useRef('-1'),
    paneViewport: useRef({x: 0, y: 0, zoom: 1}),
    //dimensions: useRef({x: 200, y: 100}),
  };
  

  if(!dialogueDataRefs.initialized.current){
    //dialogues.dialogues = [];
    dialogueDataRefs.dialogues.current.dialogues = [];
    dialogueDataRefs.nodeData_.current.position = [];
    dialogueDataRefs.nodeData_.current.nodes = [];
    dialogueDataRefs.edgeData_.current.edges = [];
    
  }

  // let dialogue = {}
  
  function DialogueDiv(){

    if(numberOptions==0)return;
    const divs = Array.from({ length: numberOptions }, (_, i) => 

    <div className="flex flex-col gap-5 my-4" key={i}>
      <span className="text-white text-[18px] font-lato">Option {i+1}</span>
      <textarea className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 font-changa rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your option here..."
        onChange={(event) => {
          dialogueDataRefs.dialogue.current.dialogueOptions[i].text = event.target.value
        }}
      />
      
    </div>
    
    );
    return <div className="flex-1 flex-col p-2 gap-5 bg-scroll overflow-auto bg-toolbarbg-3 rounded-lg">{divs}</div>;
  }

  const DialogueNodeMemo = React.memo(DialogueNode);
  const DialogueEdgeMemo = React.memo(DialogueEdge);
  const OptionEdgeMemo = React.memo(OptionEdge);

  const nodeTypes = {
    dialogue: DialogueNodeMemo,
  };

  const edgeTypes = {
    dialogue: DialogueEdgeMemo,
    option: OptionEdgeMemo,
  };

  function OptionNode({nodeId, handleId, text}){

    //console.log(`Node Id: ${nodeId}, HandleId: ${handleId}, Text: ${text}`)
    return (
      <div className="relative text-center">
        <span className="font-changaOne text-[12px] text-white">{text}</span>
        <Handle type="source" position={Position.Right} id={handleId} className="bg-illustration-orange rounded-full w-4 h-4 right-[-6px]" />
      </div>
    )
  }
  

  function DialogueNode({id, data, selected}){

    const [isSelected, setIsSelected] = useState(selected);
    const [size, setSize] = useState(data.size);
    const [edit, setEdit] = useState(data.editMode);
    
    function handleClick(){
      selected = true;
      dialogueDataRefs.selectedNode.current = id;
      setIsSelected(true);
      
    }

    function handleDoubleClick(){
      setEdit(true);
      dialogueDataRefs.editedNode.current = id;
    }

    useEffect(()=>{
      if(isSelected && selected==false){
        setIsSelected(false);
        setEdit(false);
        
      }
      
      
    }, [selected])


    //updates data when e.g. a node gets deleted
    useEffect(()=>{
      setSize(data.size);
    }, [data.size])
    

    const sizeRef = useRef(null);

    return (

      <div ref = {sizeRef} onClick={handleClick}>
        

        <NodeResizer
            
            onResize={(e)=>{
              
              setSize({x: sizeRef.current.lastElementChild.offsetParent.clientWidth, y: sizeRef.current.lastElementChild.offsetParent.clientHeight})
              data.size = ({x: sizeRef.current.lastElementChild.offsetParent.clientWidth, y: sizeRef.current.lastElementChild.offsetParent.clientHeight})
              //data.size = dialogueDataRefs.dimensions.current;
              //setSize({x: dialogueDataRefs.dimensions.current.x, y: dialogueDataRefs.dimensions.current.y});
              
            }}

            onResizeEnd={(e)=>{
              dialogueDataRefs.nodeData_.current.nodes[parseInt(""+id)-1].data.size = data.size;
             
            }}


            handleClassName="bg-mainBg-2 rounded-sm w-[8px] h-[8px]" 
            color="#000000" 
            isVisible={isSelected} 
            
            minWidth={160}
            minHeight={100}            
            
            />

        
        <div key={data} style={{width: `${size.x}px`, height: `${size.y}px`}} className={'justify-between flex flex-col gap-2 p-4 rounded-sm drop-shadow-xl shadow-2xl bg-illustration-white border-illustration1-black ' + `${isSelected ? 'border-white' : 'border-toolbarbg-1'}`} >

          
          <div className="">
          {/* {console.log(size)} */}
          {(!edit)? (
            <div className=" text-illustration-red text-[12px] font-changaOne text-center" onDoubleClick={handleDoubleClick}>{data.text}</div>
          ) : (
            <div>
              <textarea className="nodrag resize-none block p-2.5 w-full text-sm text-illustration-red bg-gray-50 font-changa rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your dialogue here..."
                onChange={(event) => {
                  dialogueDataRefs.dialogues.current.dialogues[id - 1].text = event.target.value
                  data.text = event.target.value
                  if(data.text=="")data.text = " --- Add Text ---"
                }}
              />
            </div>
          )}
          </div>

          <div className="flex flex-col gap-2">

            {data.options != null ? Object.keys(data.selects).map((selectsInstance, handleId) => (
              <div key={handleId} className="rounded-lg border-black border-2 bg-darkDesign3-black">
                <OptionNode key={handleId} nodeId={id} handleId={selectsInstance} text={data.options[handleId].text} />
              </div>
            )) : (
              <div>
                <Handle type="source" position={Position.Right} className="bg-illustration-blue rounded-full w-4 h-4 right-[-6px]" />
              </div>
            )}
          </div>

          <Handle type="target" position={Position.Left} className="bg-illustration-pink rounded-full w-4 h-4 left-[-6px]" />

          {/* Add option button */}
          <button className="text-illustration-white text-[16px] bg-illustration-orange rounded-xl font-nunito" onClick={()=>OpenAddModal(id)}>Add Option</button>
          

        </div>
        
        
      </div>
      
    )
  }

  function DialogueEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
    selected,
  }){

    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <path
          id={id}
          style={style}
          className={`react-flow__edge-path stroke-illustration-blue stroke-[6] ${selected? ('animate-pulse'): ('')}`}
          d={edgePath}
          markerEnd={markerEnd}
        />
        <text>
          <textPath href={`#${id}`} className="font-changaOne fill-slate-200 stroke-black" startOffset="50%" textAnchor="middle">
            {data.text}
          </textPath>
        </text>
      </>
    );
  }

  function OptionEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
    selected,
  }){

    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <path
          id={id}
          style={style}
          className={`react-flow__edge-path stroke-illustration-orange stroke-[6] ${selected? ('animate-pulse'): ('')}`}
          d={edgePath}
          markerEnd={markerEnd}
        />
        <text>
          <textPath href={`#${id}`} className="font-changaOne fill-slate-200 stroke-black" startOffset="50%" textAnchor="middle">
            {data.text}
          </textPath>
        </text>
      </>
    );
  }

  function PaneContextMenu({actions, position, isOpen}){

    
    return (
      isOpen?(
      <div className={`z-10 absolute flex flex-col bg-white border-4 border-toolbarbg-2`} style={{ left: `${position.x}px`, top: `${position.y}px` }} >
        {actions.map((action) => (
          <button key={action.label} className="border-none text-[18px] font-lato p-4 hover:bg-[rgba(0.1,0.1,0.1,0.1)]" onClick={action.effect}>
            {action.label}
          </button>
        ))}

      </div>):(<div></div>)
    )
  }

  function ThemePallete(){

    return (
      <div className="z-10 absolute flex flex-row top-2 right-2 bg-illustration-white w-[1000px] h-[80px] p-2 border-[1px] border-illustration-black gap-2">
        <button className="theme-light1 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-light1")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>

        <button className="theme-light2 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-light2")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>

        <button className="theme-light3 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-light3")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>

        <button className="theme-light4 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-light4")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>

        <button className="theme-dark1 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-dark1")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>

        <button className="theme-dark2 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-dark2")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>

        <button className="theme-dark3 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-dark3")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>

        <button className="theme-dark4 grid grid-cols-3 gap-2 bg-illustration-white bg-opacity-75 text-center w-[120px] h-[64px] place-content-center p-2 border-[1px] border-illustration-black" onClick={()=>{setTheme("theme-dark4")}}>
          <div className="bg-illustration-white w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-black w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-red w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-pink w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-orange w-6 h-6 rounded-full border-[1px] border-illustration-black" />
          <div className="bg-illustration-blue w-6 h-6 rounded-full border-[1px] border-illustration-black" />
        </button>
      </div>
    )
  }

  const deleteKeyArray = ['Backspace', 'Delete']

  function Flow(){

    const [nodes, setNodes, onNodesChange] = useNodesState(dialogueDataRefs.nodeData_.current.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(dialogueDataRefs.edgeData_.current.edges);

    //const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const onConnect = useCallback((params) => 
    {
      
      let updatedEdges = addEdge(params, edges);

      //let updatedEdges = dialogueDataRefs.edgeData_.current.edges;

      // update the state of edges with the returned updated array
      

      //setEdges((eds) => addEdge(params, eds));

      const source = params.source;
      const sourceHandle = params.sourceHandle;
      const target = params.target;
      const targetHandle = params.targetHandle;

      if(sourceHandle){
        
        const currentDialogue = dialogueDataRefs.dialogues.current.dialogues[parseInt(source)-1]
        currentDialogue.dialogueOptions[parseInt(sourceHandle.substring(7))].next = target;


        const edge = {
          type: 'default',
          data: {
            
          }
        }

        edge.id = `e${source}-${target}`
        edge.source = `${source}`
        edge.target = `${target}`

        edge.data.selectIndex = parseInt(sourceHandle.substring(7))
        edge.sourceHandle = 'handle-'+`${parseInt(sourceHandle.substring(7))}`
        edge.type = 'option'
        edge.data.text = "Next Dialogue"
       
        
        //remove previous edge that has the same sourceHandle and pointed elsewhere
        let index = -1;
        for (let i = 0; i < dialogueDataRefs.edgeData_.current.edges.length; i++) {

          if (dialogueDataRefs.edgeData_.current.edges[i] != null && dialogueDataRefs.edgeData_.current.edges[i].sourceHandle === edge.sourceHandle && dialogueDataRefs.edgeData_.current.edges[i].source === edge.source) {
            index = i;
            if(dialogueDataRefs.edgeData_.current.edges[i].target == edge.target)return;
            else break;
          }
        }

        if (index != -1) {
          dialogueDataRefs.edgeData_.current.edges.splice(index, 1);
          delete updatedEdges[index];
        }

        dialogueDataRefs.edgeData_.current.edges.push(edge);
        updatedEdges[updatedEdges.length-1] = edge
        updatedEdges[updatedEdges.length-1].id = `${edge.sourceHandle} `+edge.id;

        dialogueDataRefs.dialogues.current.dialogues[parseInt(source)-1].dialogueOptions[parseInt(sourceHandle.substring(7))].next = target

      }
      else{
        const edge = {
          type: 'default',
          data: {
            
          }
        }

        edge.id = `e${source}-${target}`
        edge.source = `${source}`
        edge.target = `${target}`
        edge.type = 'dialogue'
        edge.data.text = "Next Dialogue"

        //remove previous edge that pointed elsewhere
        let index = -1;
        for(let i=0;i<dialogueDataRefs.edgeData_.current.edges.length;i++){
          
          if(dialogueDataRefs.edgeData_.current.edges[i]!=null && dialogueDataRefs.edgeData_.current.edges[i].source === source){
            index = i;
            break;
          }
        }
        
        if(index!=-1){
          dialogueDataRefs.edgeData_.current.edges.splice(index, 1);
          delete updatedEdges[index];
        }
        
        dialogueDataRefs.edgeData_.current.edges.push(edge)

        updatedEdges[updatedEdges.length-1] = edge
        updatedEdges[updatedEdges.length-1].id = edge.id;

        dialogueDataRefs.dialogues.current.dialogues[parseInt(source)-1].next = target
        
      }
     
      setEdges(updatedEdges)

      for(let i=0;i<updatedEdges.length;i++){
        if(updatedEdges[i]==null || updatedEdges[i] == undefined){
          updatedEdges.splice(i,1)
        }
      }

      //console.log(`${dialogueDataRefs.edgeData_.current.edges.length}, ${updatedEdges.length}`)
      
    })

    

    const [paneContextMenuPosition, setPaneContextMenuPosition] = useState({x:0, y:0})
    const [paneContentMenuIsOpen, setPaneContentMenuIsOpen] = useState(false)
    
    reactFlowInstance = useReactFlow();

    const reactFlowRef = useRef(null)

    const deselectAll = useCallback(() => {
      setNodes((nds) =>
        nds.map((node) => {
          node.selected = false;
          return node;
        })
      );

      setEdges((eds) =>
        eds.map((edge) => {
          edge.selected = false;
          return edge;
        })
      );
    }, [setNodes, setEdges]);

    const handleOnPaneClick = async()=>{
      deselectAll();
      dialogueDataRefs.selectedNode.current = '-1';
      setPaneContentMenuIsOpen(false);

      
    }

    const handleOnPaneLeave = async()=>{
      deselectAll();
      dialogueDataRefs.selectedNode.current = '-1';
    }

    const handleOnPaneScroll = async(e)=>{
      
      dialogueDataRefs.paneViewport.current.zoom = reactFlowInstance.getZoom()
    }

    const handleOnDragStart = async(e)=>{
      //console.log(e)
      const panning = {x: reactFlowInstance.getViewport().x, y: reactFlowInstance.getViewport().y}
      dialogueDataRefs.paneViewport.current.x = panning.x;
      dialogueDataRefs.paneViewport.current.y = panning.y;
    }

    const handleOnDragEnd = async(e)=>{
      //console.log(e)
      const panning = {x: reactFlowInstance.getViewport().x, y: reactFlowInstance.getViewport().y}
      dialogueDataRefs.paneViewport.current.x = panning.x;
      dialogueDataRefs.paneViewport.current.y = panning.y;
      
    }

    function onHandleNodesChange(nodeChanges){
      onNodesChange(nodeChanges)
      //console.log(nodeChanges)
      
      const length = nodeChanges.length

      for(let i=0;i<length;i++){
        const id = nodeChanges[i].id;
        const type = nodeChanges[i].type;
        
        if(type=="position"){
          const position = nodeChanges[i].position;
          const dragging  = nodeChanges[i].dragging;

          if(dragging){
            dialogueDataRefs.nodeData_.current.nodes[parseInt(id)-1].position = position;
            
          }
          else{
            if(position){
              dialogueDataRefs.nodeData_.current.nodes[parseInt(id)-1].position = position;
              
            }
          }
          
        }

        if(type=="remove"){

          let index = -1;
          const dLength = dialogueDataRefs.dialogues.current.dialogues.length;
          for(let j=0;j<dLength;j++){
            if(dialogueDataRefs.dialogues.current.dialogues[j]!=null && dialogueDataRefs.dialogues.current.dialogues[j].id == id){
              
              index = j;
              break;
            }
          }
          if(index !=-1){

            for (let j=(index+1);j<dLength;j++){
              if(dialogueDataRefs.dialogues.current.dialogues[j] != null){
                dialogueDataRefs.dialogues.current.dialogues[j].id = ""+(parseInt(dialogueDataRefs.dialogues.current.dialogues[j].id)-1);
              }

              if(dialogueDataRefs.nodeData_.current.nodes[j]!=null){
                dialogueDataRefs.nodeData_.current.nodes[j].id = ""+(parseInt(dialogueDataRefs.nodeData_.current.nodes[j].id)-1);
              }
            }

            for(let j=0;j<dialogueDataRefs.edgeData_.current.edges.length;j++){
              if(dialogueDataRefs.edgeData_.current.edges[j]!=null && (dialogueDataRefs.edgeData_.current.edges[j].target == id || dialogueDataRefs.edgeData_.current.edges[j].source == id) ){
                dialogueDataRefs.edgeData_.current.edges.splice(j, 1)
              }
            }


            setEdges(dialogueDataRefs.edgeData_.current.edges);
            

            dialogueDataRefs.dialogues.current.dialogues.splice(index, 1);
            dialogueDataRefs.nodeData_.current.nodes.splice(index, 1);
            
            dialogueDataRefs.id.current--;

            setNodes(dialogueDataRefs.nodeData_.current.nodes);
            
          }

        }
      }
    }

    function onHandleEdgesChange(edgeChanges){
      onEdgesChange(edgeChanges)
      console.log(edgeChanges)
      
      const length = edgeChanges.length

      for(let i=0;i<length;i++){
        const id = edgeChanges[i].id;
        
        const type = edgeChanges[i].type;
        
        if(type=="remove"){
          
          //console.log(id)
          let index = -1;

          for(let j=0;j<dialogueDataRefs.edgeData_.current.edges.length;j++){
            if(dialogueDataRefs.edgeData_.current.edges[j] != null && dialogueDataRefs.edgeData_.current.edges[j].id === id){
              index = j;
              break;
            }
          }

          if(index != -1){
            //const index = dialogueDataRefs.edgeData_.current.edges.indexOf(id);
            dialogueDataRefs.edgeData_.current.edges.splice(index, 1);
          

            if(id.includes('handle')){
              //console.log(id.split(' ')[1].substring(1).split('-')[0])
              const edgePoints = id.split(' ')[1].substring(1).split('-');
              const sourceId = edgePoints[0];
              const targetId = edgePoints[1];

              const handleId = id.split(' ')[0].substring(7);

              //console.log(targetId)
              dialogueDataRefs.dialogues.current.dialogues[parseInt(sourceId)-1].dialogueOptions[parseInt(handleId)].next = "";
            }
            else{
              const edgePoints = id.substring(1).split('-');
              const sourceId = edgePoints[0];
              const targetId = edgePoints[1];

              dialogueDataRefs.dialogues.current.dialogues[parseInt(sourceId)-1].next = "";
            }

            setEdges(dialogueDataRefs.edgeData_.current.edges);
          }
         
        }
      }
    }
    

    return (
      <div className="flex flex-row w-full">
        <ReactFlow 

          ref={reactFlowRef}

          nodes={nodes}
          edges={edges}
          onNodesChange={onHandleNodesChange}
          onEdgesChange={onHandleEdgesChange}

          // defaultNodes={dialogueDataRefs.nodeData_.current.nodes}
          onPaneContextMenu={(e)=>{
            e.preventDefault();

			const rect = reactFlowRef.current.getBoundingClientRect();
            const position = {
               x: e.clientX-rect.left-128,
               y: e.clientY-rect.top
            };


            setPaneContextMenuPosition({x: position.x, y: position.y});
            setPaneContentMenuIsOpen(true);
          }}
          onPaneClick={handleOnPaneClick}
          onPaneMouseLeave={handleOnPaneLeave}
          onWheelCapture ={(e)=>handleOnPaneScroll(e)}

          onMoveStart={(e)=>handleOnDragStart(e)}
          onMoveEnd={(e)=>handleOnDragEnd(e)}
          

          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          
          onConnect={onConnect}
          

          zoomOnDoubleClick={false}

          defaultViewport={dialogueDataRefs.paneViewport.current}

          deleteKeyCode={deleteKeyArray}
          
          >
          <PaneContextMenu

            actions={
              [
                { label: "Add Dialogue Node", effect: ()=>
                  {
                    
                    const bounds = reactFlowRef.current.getBoundingClientRect();
                    const position = reactFlowInstance.project({
                       x: paneContextMenuPosition.x,
                       y: paneContextMenuPosition.y
                    });
                    reactFlowInstance.addNodes(AddNode({x_: position.x, y_: position.y}))
                    setPaneContentMenuIsOpen(false)
                    
                    //console.log(reactFlowInstance.getViewport())
                  } 
                },
                { label: "Cancel", effect: ()=>{
                    setPaneContentMenuIsOpen(false)
                } },
              ]
            }

            position={paneContextMenuPosition}

            isOpen={paneContentMenuIsOpen}
          />

          <ThemePallete />
          
          <Background />
          <Controls />
        </ReactFlow>
        
      </div>
    );
  }

  function OpenAddModal(id){
    
    dialogueDataRefs.dialogue.current = dialogueDataRefs.dialogues.current.dialogues[parseInt(id)-1];
    if(!dialogueDataRefs.dialogue.current.text)dialogueDataRefs.dialogue.current.text = "--- Add Text ---"
    //console.log(dialogueDataRefs.dialogue.current);
    
    setAddModal(true);
    
  }

  function OKButtonModal(){
    dialogueDataRefs.dialogues.current.dialogues[parseInt(dialogueDataRefs.dialogue.current.id)-1] = dialogueDataRefs.dialogue.current;

    dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].data.text = dialogueDataRefs.dialogue.current.text;

    if(dialogueDataRefs.dialogue.current.dialogueOptions){

      dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].data.selects = {}
      for(let i=0;i<dialogueDataRefs.dialogue.current.dialogueOptions.length;i++){
        assign(dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].data.selects, 'handle-'+`${i}`, 'default')
      }
    }

    //console.log(dialogueDataRefs.dialogues.current.dialogues[parseInt(dialogueDataRefs.dialogue.current.id)-1])

    dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].data.options = dialogueDataRefs.dialogue.current.dialogueOptions;

    const attachedEdges = [];
    for(let i=0;i<dialogueDataRefs.edgeData_.current.edges.length;i++){

      if(dialogueDataRefs.edgeData_.current.edges[i] != null && dialogueDataRefs.edgeData_.current.edges[i].source == dialogueDataRefs.dialogue.current.id){
        attachedEdges.push(i);
        delete dialogueDataRefs.edgeData_.current.edges[i];
      }
    }
    for(let i=0;i<dialogueDataRefs.edgeData_.current.edges.length;i++){
      if(dialogueDataRefs.edgeData_.current.edges[i] == null || dialogueDataRefs.edgeData_.current.edges[i] == undefined){
        dialogueDataRefs.edgeData_.current.edges.splice(i, 1);
      }
    }

    if(numberOptions == 0){
      dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].data.options = null;
    }
    else{
      dialogueDataRefs.dialogue.current.next = "";
      dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].next = "";
	  
	  dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].data.size = data.size+numberOptions*(0,100);
    }
    


    setAddModal(false);
  }

  function CancelButtonModal(){
    setAddModal(false)
  }

  function AddNode({x_, y_}){

    dialogueDataRefs.dialogue.current = {};
    dialogueDataRefs.numberOptions.current = 0;
    dialogueDataRefs.addModal.current = false;
    dialogueDataRefs.initialized.current = true;

    dialogueDataRefs.dialogue.current = {...dialogueDataRefs.dialogue.current, id: ''+dialogueDataRefs.id.current, text: " --- Add Text ---", next: '', action: ''};

    
    const node = {
      id: dialogueDataRefs.dialogue.current.id,
      type: 'dialogue',
      data: {
        text: dialogueDataRefs.dialogue.current.text, 
        options: dialogueDataRefs.dialogue.current.dialogueOptions,
        selects: {
          
        },
        editMode: false,
        size: {x: 200, y: 100},
      },
      selected: false,
      position: {x: x_, y: y_}
    }

    dialogueDataRefs.id.current++;
    //setID(id+1)
    dialogueDataRefs.dialogues.current.dialogues.push(dialogueDataRefs.dialogue.current);
    //nodeData.nodes.push(node);
    dialogueDataRefs.nodeData_.current.nodes.push(node);

    //console.log(dialogueDataRefs.dialogues.current.dialogues)
    
    
    return node;
  }

  function assign(obj, prop, value) {
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        var e = prop.shift();
        assign(obj[e] =
                 Object.prototype.toString.call(obj[e]) === "[object Object]"
                 ? obj[e]
                 : {},
               prop,
               value);
    } else
        obj[prop[0]] = value;
  }
  
  const saveDialogues = async ()=>{
    
    downloadFile()
  }

  async function downloadFile() {
    try {
      
      const blob = new Blob([JSON.stringify(dialogueDataRefs.dialogues.current, null, 2)], {type: "application/json"});//await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'character.json');
      document.body.appendChild(link);
      link.click();
      // setMessage('File downloaded successfully');
    } catch (error) {
      console.error(error);
    }
  }
  
  
  return (
    <>
      <Head>
        <title>Branching Dialogues UI</title>
        <meta name="description" content="Branching Dialogues UI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"bg-darkDesign3-brown flex flex-col h-screen "+theme}>

        {/* Toolbar */}
        <div className="flex flex-col bg-illustration-blue h-[100px] w-full border-b-illustration-white border-b-2 pl-8 shadow-xl drop-shadow-xl">
          <span className="font-lato text-[36px] text-illustration-white">DialogueCraft</span>
          <span className="font-lato text-[24px] text-illustration-white italic">A Branching Dialogue System that helps you build Interactive Dialogue with Precision</span>
        </div>

        <div className="flex flex-row bg-darkDesign3-black h-full max-md:min-w-max max-md:w-full">
          
          
          {/* User Interface */}
          <div className="flex flex-row rounded-xl shadow-lg w-[410px] h-[576px] mt-8 ml-[100px]">
            {/* UI Buttons */}

            <div className="flex flex-col ml-4 gap-2 p-2">

              <div className="flex flex-col min-h-max items-start gap-5">
                {/* SAVE BUTTON */}
                <button className="rounded-lg border-none hover:bg-illustration-white hover:text-illustration-red bg-illustration-orange font-lato text-illustration-white text-[18px] text-center items-center cursor-pointer w-[170px] h-[56px]" onClick={saveDialogues}>
                  SAVE{/* <span className="rounded-lg px-[60px] py-[12px] text-center items-center bg-toolbarbg-3 text-orange-50 hover:bg-transparent transition ease-out duration-75 hover:text-toolbarbg-2">SAVE</span> */}
                </button>
                <Link target="_blank" rel="noreferrer" href="https://www.buymeacoffee.com/pegiannos">
                  <button className="rounded-lg border-none hover:bg-illustration-white hover:text-illustration-red bg-illustration-orange font-lato text-illustration-white text-[18px] text-center items-center cursor-pointer w-[170px] h-[56px]">
                    Buy me a coffee!{/* <span className="rounded-lg px-[60px] py-[12px] text-center items-center bg-toolbarbg-3 text-orange-50 hover:bg-transparent transition ease-out duration-75 hover:text-toolbarbg-2">SAVE</span> */}
                  </button>
                </Link>
              </div>
            </div>

            {/* Dialogue UI */}
            
            {addModal? (
              <React.Fragment>
                <div className="absolute w-[1024px] h-[576px] bg-toolbarbg-1 rounded-xl shadow-lg p-8">
                  <div className="flex flex-col gap-4">
                    <span className="text-white text-[18px] font-lato">Dialogue Text Area</span>
                    <textarea rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 font-changa rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your dialogue here..." defaultValue={dialogueDataRefs.dialogue.current.text} onChange={(e)=>{dialogueDataRefs.dialogue.current.text = (e.target.value)}} />
                    <span className="text-white text-[18px] font-lato">Options</span>
                    
                    <div className="flex flex-row gap-4 h-[250px] w-full">
                        <div className="flex flex-col gap-2 w-[160px]">
                          <span className="text-white text-[18px] font-lato">Number of Options</span>
                          <input className="text-center w-16 p-2 rounded-sm" placeholder=""
                          onChange={(event) => {
                            if(event.target.value.match(/^\d+$/)===null){
                              if(event.target.value.length>0){
                                event.target.value = event.target.value.replace(/\D/g,'');
                              }  
                              else event.target.value = "";
                                
                            }
                            else {
                              let inputNumber = parseInt(event.target.value);
                              event.target.value = inputNumber;
                            }

                            if(event.target.value === ""){
                              setNumberOptions(0)

                              dialogueDataRefs.dialogue.current.dialogueOptions = []
                              
                            }
                            else {
                              const numOptions = parseInt(event.target.value)
                              setNumberOptions(numOptions)
                              
                              dialogueDataRefs.dialogue.current.dialogueOptions = []
                              
                              for (let i = 0; i < numOptions; i++) {

                                const optionTemp = {
                                  "text" : "",
                                  "next" : "" 
                                }
                                dialogueDataRefs.dialogue.current.dialogueOptions.push(optionTemp)
                                
                              }
                              
                            }
                          }}
                          
                          />
                        </div>
                        <DialogueDiv />
                    </div>

                    <div className="flex flex-row gap-2">
                      <button className="font-changaOne text-[18px] text-toolbarbg-1 rounded-lg border-toolbarbg-1 border-2 p-2 bg-white" onClick={OKButtonModal}>OK</button>
                      <button className="font-changaOne text-[18px] text-toolbarbg-1 rounded-lg border-toolbarbg-1 border-2 p-2 bg-white" onClick={CancelButtonModal}>CANCEL</button>
                    </div>
                  </div>
                </div>

              </React.Fragment>
            ): (
              <div>
                
              </div>
            )}
            
          </div>
          
          {addModal? (
            <div></div>
          ):(
            <div className="flex flex-row bg-illustration-white border-darkDesign4-gray shadow-lg border-[2px] w-full h-[800px] mt-8 mx-[20px]">
              {/* Node System */}
              <ReactFlowProvider>
                <Flow />
              </ReactFlowProvider>
              
            </div>
            
          )}
          
          

        </div>        
      </main>
    </>
  )
}
