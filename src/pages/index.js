import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
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
  // const [dialogueText, setDialogueText] = useState("")
  // const [dialogue, setDialogue] = useState({})
  // const [dialogues, setDialogues] = useState({})
  //const [nodeData, setNodeData] = useState({})
  //const [edgeData, setEdgeData] = useState({})
  //const [initialized, setInitialized] = useState(false)
  // const [id, setID] = useState(1)
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
        <Handle type="source" position={Position.Right} id={handleId} className="bg-mainBg-6 rounded-full w-4 h-4 right-[-6px]" />
      </div>
    )
  }
  

  function DialogueNode({id, data, selected}){

    const [isSelected, setIsSelected] = useState(selected);
    const [size, setSize] = useState({x:data.size.x,y:data.size.y});
    const [edit, setEdit] = useState(data.editMode);
    
    function handleClickOutside(){
      // setIsSelected(false);
      // setEdit(false);
      // dialogueDataRefs.editedNode.current = 0;
      // console.log("clickoutside")
     
    }

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
        
        // console.log("deselect "+ id)
      }
      
      
    }, [selected])

    const sizeRef = useRef(null);

    return (

      
      // <OutsideClickHandler onOutsideClick={()=>handleClickOutside()}>
      <div ref = {sizeRef} onClick={handleClick}>
        

        <NodeResizer
            
            onResize={(e)=>{
              //console.log(e.sourceEvent)
              //setSize({x: e.sourceEvent.target.offsetParent.clientWidth, y: e.sourceEvent.target.offsetParent.clientHeight});
              //updateNodeInternals(id);
              //console.log(sizeRef)
              //console.log(sizeRef)
              setSize({x: sizeRef.current.lastElementChild.offsetParent.clientWidth, y: sizeRef.current.lastElementChild.offsetParent.clientHeight})
            }}

            handleClassName="bg-mainBg-2 rounded-sm w-[8px] h-[8px]" 
            color="#000000" 
            isVisible={isSelected} 
            
            minWidth={160}
            minHeight={100}            
            
            />

        
        <div key={data} style={{minWidth: `${size.x}px`, minHeight: `${size.y}px`}} className={'justify-between flex flex-col gap-2 p-4 rounded-sm border-2 bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-700 ' + `${isSelected ? 'border-white' : 'border-toolbarbg-1'}`} >

          
          <div className="h-max">
          {/* {console.log(size)} */}
          {(!edit)? (
            <div className=" text-white text-[12px] font-changaOne overflow-auto text-center" onDoubleClick={handleDoubleClick}>{data.text}</div>
          ) : (
            <div>
              <textarea className="nodrag resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 font-changa rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your dialogue here..."
                onChange={(event) => {
                  dialogueDataRefs.dialogues.current.dialogues[id - 1].text = event.target.value
                  data.text = event.target.value
                }}
              />
            </div>
          )}
          </div>

          <div className="flex flex-col gap-2">

            {data.options != null ? Object.keys(data.selects).map((selectsInstance, handleId) => (
              <div key={handleId} className="rounded-lg border-black border-2 bg-toolbarbg-1">
                <OptionNode key={handleId} nodeId={id} handleId={selectsInstance} text={data.options[handleId].text} />
              </div>
            )) : (
              <div>
                <Handle type="source" position={Position.Right} className="bg-mainBg-6 rounded-full w-4 h-4 right-[-6px]" />
              </div>
            )}
          </div>

          <Handle type="target" position={Position.Left} className="bg-mainBg-4 rounded-full w-4 h-4 left-[-6px]" />

          {/* Add option button */}
          <button className="text-white text-[16px] bg-gradient-to-bl from-orange-400 via-orange-800 to-orange-600 rounded-xl font-nunito" onClick={()=>OpenAddModal(id)}>Add Option</button>
          

        </div>
        
        
      </div>
      // </OutsideClickHandler>
      
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
          className={`react-flow__edge-path stroke-[6] ${selected? ('stroke-orange-600'): ('stroke-orange-800')}`}
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
          className={`react-flow__edge-path stroke-[6] ${selected? ('stroke-blue-600'): ('stroke-blue-800')}`}
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

          if (dialogueDataRefs.edgeData_.current.edges[i] != null && dialogueDataRefs.edgeData_.current.edges[i].sourceHandle === edge.sourceHandle) {
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

        //updatedEdges = dialogueDataRefs.edgeData_.current.edges;
        
        
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


      console.log(`${dialogueDataRefs.edgeData_.current.edges.length}, ${updatedEdges.length}`)
      
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
      // console.log(nodeChanges)
      
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
        }
      }
    }

    function onHandleEdgesChange(edgeChanges){
      onEdgesChange(edgeChanges)
      //console.log(edgeChanges)
      
      const length = edgeChanges.length

      for(let i=0;i<length;i++){
        const id = edgeChanges[i].id;
        
        const type = edgeChanges[i].type;
        
        if(type=="remove"){
          
          //console.log(id)
          const index = dialogueDataRefs.edgeData_.current.edges.indexOf(id);
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

            const position = {
               x: e.clientX - 400,
               y: e.clientY - 100
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
          
          

          >
          <PaneContextMenu

            actions={
              [
                { label: "Add Dialogue Node", effect: ()=>
                  {
                    
                    const bounds = reactFlowRef.current.getBoundingClientRect();
                    const position = reactFlowInstance.project({
                       x: paneContextMenuPosition.x-128,
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

    //console.log(id)
    // setDialogue({})

    // setNumberOptions(0)
    
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

    console.log(dialogueDataRefs.dialogues.current.dialogues[parseInt(dialogueDataRefs.dialogue.current.id)-1])

    dialogueDataRefs.nodeData_.current.nodes[parseInt(dialogueDataRefs.dialogue.current.id)-1].data.options = dialogueDataRefs.dialogue.current.dialogueOptions;

    let index = -1;
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
    


    setAddModal(false);
  }

  function CancelButtonModal(){
    setAddModal(false)
  }

  function AddNode({x_, y_}){

    //setDialogue({})

    //setNumberOptions(0)

    //setAddModal(false);
    //setInitialized(true);
    dialogueDataRefs.dialogue.current = {};
    dialogueDataRefs.numberOptions.current = 0;
    dialogueDataRefs.addModal.current = false;
    dialogueDataRefs.initialized.current = true;
    //dialogue.id = ""+id;
    
    //dialogue.text = ""+dialogueText;

    dialogueDataRefs.dialogue.current = {...dialogueDataRefs.dialogue.current, id: ''+dialogueDataRefs.id.current, text: " --- Add Text ---", next: ''};

    
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

  const OKButton = async()=>{
    setAddModal(false);
    setInitialized(true);

    dialogue.id = ""+id;
    
    dialogue.text = ""+dialogueText;
    
    //console.log(JSON.stringify(dialogues, null, 2));
    // nodeData.position.push({x: 0, y: 0})
    const node = {
      id: dialogue.id,
      type: 'dialogue',
      data: {
        text: dialogue.text, 
        options: dialogue.dialogueOptions,
        selects: {
          
        }
      },
      //position: {x: (256+10)*dialogue.id, y: 40},
      position: {x: paneContextMenuPosition.x, y: paneContextMenuPosition.y}
    }

    if(dialogue.dialogueOptions!=null){
      node.data.selects = {}
      for(let i=0;i<dialogue.dialogueOptions.length;i++){
        assign(node.data.selects, 'handle-'+`${i}`, 'default')

        if(dialogue.dialogueOptions[i].next==="" || dialogue.dialogueOptions[i].next === null){
          window.alert('Every option needs to have a next parameter');

          return;
        }

        const edge = {
          type: 'default',
          data: {
            
          }
        }


        edge.id = `e${dialogue.id}-${dialogue.dialogueOptions[i].next}`
        edge.source = `${dialogue.id}`
        edge.target = `${dialogue.dialogueOptions[i].next}`

        edge.data.selectIndex = i
        edge.sourceHandle = 'handle-'+`${i}`
        // console.log(edge)
        edgeData.edges.push(edge)
      }
      
      
    }
    else{

      const edge = {
        type: 'default',
        data: {
          
        }
      }

      edge.id = `e${dialogue.id}-${id}`
      edge.source = `${dialogue.id}`
      edge.target = `${id+1}`
      edgeData.edges.push(edge)
      
    }

    setID(id+1)
    dialogues.dialogues.push(dialogue);

    nodeData.nodes.push(node);
    // edgeData.edges.push(edge)

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
      <main className="bg-mainBg-1">
        <div className="flex flex-row bg-gradient-to-b from-mainBg-1 via-mainBg-2 to-mainBg-1 min-h-screen max-md:min-w-max max-md:w-full">
          
          {/* Toolbar */}
          <div></div>
          {/* User Interface */}
          <div className="flex flex-row bg-toolbarbg-1 rounded-xl shadow-lg w-[410px] h-[576px] mt-[100px] ml-[100px]">
            {/* UI Buttons */}

            <div className="flex flex-col bg-toolbarbg-3 ml-4 mt-4 gap-2 p-2">

              {/* <div className="flex flex-row min-h-max items-start gap-5">

                Add button
                <button className="rounded-lg border-none bg-toolbarbg-1 font-lato text-white bg-gradient-to-t from-orange-800 via-orange-300 to-orange-500 text-[18px] text-center items-center cursor-pointer w-[170px] h-[56px]" onClick={openAddModal}>
                  <span className="rounded-lg px-[60px] py-[12px] text-center items-center bg-toolbarbg-3 text-orange-50 hover:bg-transparent transition ease-out duration-75 hover:text-toolbarbg-2">ADD</span>
                </button>
                
                Option button
                <button className="rounded-lg border-none bg-toolbarbg-1 font-lato text-white bg-gradient-to-t from-blue-800 via-blue-300 to-blue-500 text-[18px] text-center items-center cursor-pointer w-[170px] h-[56px]">
                  <span className="rounded-lg px-[60px] py-[12px] text-center items-center bg-toolbarbg-3 text-orange-50 hover:bg-transparent transition ease-out duration-75 hover:text-toolbarbg-2">EDIT</span>
                </button>
              </div> */}

              <div className="flex flex-row min-h-max items-start gap-5">
                {/* SAVE BUTTON */}
                <button className="rounded-lg border-none bg-toolbarbg-1 font-lato text-white bg-gradient-to-t from-lime-800 via-lime-300 to-lime-500 text-[18px] text-center items-center cursor-pointer w-[170px] h-[56px]" onClick={saveDialogues}>
                  <span className="rounded-lg px-[60px] py-[12px] text-center items-center bg-toolbarbg-3 text-orange-50 hover:bg-transparent transition ease-out duration-75 hover:text-toolbarbg-2">SAVE</span>
                </button>
              </div>
            </div>

            {/* Dialogue UI */}
            {/* <DialoguePreviewDiv>

            </DialoguePreviewDiv> */}
            
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

                              // dialogueDataRefs.id.current = ""
                              // dialogueDataRefs.dialogue.current.text = ""
                              dialogueDataRefs.dialogue.current.dialogueOptions = []
                              
                            }
                            else {
                              const numOptions = parseInt(event.target.value)
                              setNumberOptions(numOptions)
                              
                              // dialogueDataRefs.id.current = ""
                              // dialogueDataRefs.dialogue.current.text = ""
                              dialogueDataRefs.dialogue.current.dialogueOptions = []
                              
                              for (let i = 0; i < numOptions; i++) {

                                const optionTemp = {
                                  "text" : "",
                                  "next" : "" 
                                }
                                dialogueDataRefs.dialogue.current.dialogueOptions.push(optionTemp)
                                
                              }
                              //console.log(JSON.stringify(dialogue, null, 2))
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
            <div className="flex flex-row bg-toolbarbg-3 w-full h-[800px] mt-[100px] ml-[20px]">
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
