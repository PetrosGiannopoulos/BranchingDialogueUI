import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useState } from 'react'
import { useEffect} from 'react'
import fs from 'fs-extra'
import axios from 'axios'
import { useRouter } from 'next/router'
import OutsideClickHandler from 'react-outside-click-handler';

const inter = Inter({ subsets: ['latin'] })


export default function Home() {


  const [addModal, setAddModal] = useState(false)
  const [numberOptions, setNumberOptions] = useState(0)
  const [dialogueText, setDialogueText] = useState("")
  const [dialogue, setDialogue] = useState({})
  const [dialogues, setDialogues] = useState({})
  const [initialized, setInitialized] = useState(false)
  const [id, setID] = useState(1)


  if(!initialized)dialogues.dialogues = []

  // let dialogue = {}
  
  function DialogueDiv(){

    if(numberOptions==0)return;
    const divs = Array.from({ length: numberOptions }, (_, i) => 

    <div className="flex flex-col gap-5 my-4" key={i}>
      <span className="text-white text-[18px] font-lato">Option {i+1}</span>
      <textarea className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 font-changa rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your option here..."
        onChange={(event) => {
          dialogue.dialogueOptions[i].text = event.target.value
        }}
      />
      <input className="text-center w-16 p-2 rounded-sm"
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
          
          if(event.target.value === "" || inputNumber === 0 || inputNumber === i){

          }
          else{
            dialogue.dialogueOptions[i].next = event.target.value
          }

        }
      }}
      />
    </div>
    
    );
    return <div className="flex-1 flex-col p-2 gap-5 bg-scroll overflow-auto bg-toolbarbg-3 rounded-lg">{divs}</div>;
  }

  function DialogueOptionPreview({index}){

    if(numberOptions==0)return;
    const divs = Array.from({length: dialogues.dialogues[index].dialogueOptions.length}, (_, i)=>
    
      <div key={i}>
        <div className="font-changaOne text-end text-[18px] text-cyan-900 rounded-lg border-none p-2 bg-gradient-to-t from-blue-800 via-blue-300 to-blue-500">
          <span className="">{i+1}) {dialogues.dialogues[index].dialogueOptions[i].text}</span>
        </div>
      </div>
    );
    // <div className="font-changaOne text-[18px] text-cyan-900 rounded-lg border-none p-2 bg-gradient-to-t from-blue-800 via-blue-300 to-blue-500">
    //       <span className="align-middle">Option 1</span>
    //     </div>
    return <div className="flex flex-col w-max justify-end items-end justify-self-end justify-items-end gap-2">{divs}</div>
  }

  function DialoguePreviewDiv(){
    const divs = Array.from({length: dialogues.dialogues.length}, (_, i)=>
    
      <div className="flex flex-col gap-4 text-end items-end w-max" key={i}>
        <div className="font-changaOne text-[18px] text-red-900 rounded-lg border-none p-2 bg-gradient-to-t from-orange-800 via-orange-300 to-orange-500">
          <span className="">{dialogues.dialogues[i].text}</span>
        </div>
        <DialogueOptionPreview index = {i}>

        </DialogueOptionPreview>
        
      </div>
    );

    return <div className="flex flex-col bg-toolbarbg-3 ml-4 mt-4 p-2 w-full bg-scroll items-end h-[560px] overflow-auto gap-2">{divs}</div>
  }

  const Node = ({ id, text, options }) => {
    const [isSelected, setIsSelected] = useState(false);
  
    const handleClickOutside = () => {
      setIsSelected(false);
    };

    return (
      <OutsideClickHandler onOutsideClick={handleClickOutside}>
        <div className={'box-content flex flex-col gap-4 p-4 ml-8 rounded-lg w-[256px] border-white bg-toolbarbg-2 '+`${isSelected ? 'border-2':'border-1'}`} onClick={() => setIsSelected(true)}>
          {/* Node Text */}
          <div className="text-white text-[12px] font-changaOne overflow-auto">{text}</div>
          {/* Node Input */}
          {id>1?(
            <div className="relative bg-mainBg-4 border-white border-2 rounded-full w-4 h-4 left-[-25px]"></div>
          ):(
            <div>

            </div>
          )}
          {/* Node Options */}
          <div className="flex flex-col gap-2">
            {options!=null ?options.map((optionsInstance, index)=>(
              // Node Option
              <div key={index} className="box-content rounded-lg p-2 w-[240px] border-white border-2 bg-toolbarbg-3">
                <span className="font-changaOne text-[12px] text-white">{optionsInstance.text}</span>
              </div>
            )) : (
              <div></div>
            )}
          </div>

          <div className="relative bg-mainBg-6 border-white border-2 rounded-full w-4 h-4 right-[-264px]"></div>
          {/*<div className="node-options">
            {options.map((option, index) => (
              <div key={index} className="node-option">
                <div className="node-option-text">{option.text}</div>
                <Node id={option.next} text={dialogues.dialogues.find(dialogueInstance => dialogueInstance.id === option.next).text} options={data.dialogues.find(dialogueInstance => dialogueInstance.id === option.next).dialogueOptions}/>
              </div>
            ))}
          </div> */}
        </div>
      </OutsideClickHandler>
    );
  };

  const mapToObj = m => {
    return Array.from(m).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  };

  const mapToAoO = m => {
    return Array.from(m).map( ([k,v]) => {return {[k]:v}} );
  };

  const openAddModal = async() =>{
    setAddModal(true);

    setDialogue({})

    setNumberOptions(0)
    // dialogue.id = "1";

    // dialogues.dialogues.push(dialogue)

    // dialogue = {};

    // dialogue.id = "2";

    // dialogues.dialogues.push(dialogue)

    //console.log(JSON.stringify(dialogues, null, 2))
    
  }

  const closeAddModal = async()=>{
    setAddModal(false)
  }

  const OKButton = async()=>{
    setAddModal(false);
    setInitialized(true);

    dialogue.id = ""+id;
    setID(id+1)
    dialogue.text = ""+dialogueText;
    
    
    dialogues.dialogues.push(dialogue);

    console.log(JSON.stringify(dialogues, null, 2));
  }

  const CancelButton = async()=>{
    setAddModal(false);
  }

  const saveDialogues = async ()=>{
    
    downloadFile()
  }

  async function downloadFile() {
    try {
      
      const blob = new Blob([JSON.stringify(dialogues, null, 2)], {type: "application/json"});//await response.blob();
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
        <div className="flex flex-col bg-gradient-to-b from-mainBg-1 via-mainBg-2 to-mainBg-1 min-h-screen max-md:min-w-max max-md:w-full">
          
          {/* Toolbar */}
          <div></div>
          {/* User Interface */}
          <div className="flex flex-row bg-toolbarbg-1 rounded-xl shadow-lg w-[410px] h-[576px] mt-[100px] ml-[100px]">
            {/* UI Buttons */}

            <div className="flex flex-col bg-toolbarbg-3 ml-4 mt-4 gap-2 p-2">

              <div className="flex flex-row min-h-max items-start gap-5">

                {/* ADD BUTTON */}
                <button className="rounded-lg border-none bg-toolbarbg-1 font-lato text-white bg-gradient-to-t from-orange-800 via-orange-300 to-orange-500 text-[18px] text-center items-center cursor-pointer w-[170px] h-[56px]" onClick={openAddModal}>
                  <span className="rounded-lg px-[60px] py-[12px] text-center items-center bg-toolbarbg-3 text-orange-50 hover:bg-transparent transition ease-out duration-75 hover:text-toolbarbg-2">ADD</span>
                </button>
                {/* OPTIONS BUTTON */}
                <button className="rounded-lg border-none bg-toolbarbg-1 font-lato text-white bg-gradient-to-t from-blue-800 via-blue-300 to-blue-500 text-[18px] text-center items-center cursor-pointer w-[170px] h-[56px]">
                  <span className="rounded-lg px-[60px] py-[12px] text-center items-center bg-toolbarbg-3 text-orange-50 hover:bg-transparent transition ease-out duration-75 hover:text-toolbarbg-2">EDIT</span>
                </button>
              </div>

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
                    <textarea rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 font-changa rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your dialogue here..." onChange={(e)=>setDialogueText(e.target.value)}/>
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

                              dialogue.id = ""
                              dialogue.text = ""
                              dialogue.dialogueOptions = []
                              
                            }
                            else {
                              const numOptions = parseInt(event.target.value)
                              setNumberOptions(numOptions)
                              dialogue.id = ""
                              dialogue.text = ""
                              dialogue.dialogueOptions = []
                              for (let i = 0; i < numOptions; i++) {

                                const optionTemp = {
                                  "text" : "",
                                  "next" : "" 
                                }
                                dialogue.dialogueOptions.push(optionTemp)
                                
                              }
                              //console.log(JSON.stringify(dialogue, null, 2))
                            }
                          }}
                          
                          />
                        </div>
                        <DialogueDiv>

                        </DialogueDiv>
                    </div>
                    
                    <div className="flex flex-row gap-2">
                      <button className="font-changaOne text-[18px] text-toolbarbg-1 rounded-lg border-toolbarbg-1 border-2 p-2 bg-white" onClick={OKButton}>OK</button>
                      <button className="font-changaOne text-[18px] text-toolbarbg-1 rounded-lg border-toolbarbg-1 border-2 p-2 bg-white" onClick={CancelButton}>CANCEL</button>
                    </div>
                  </div>
                </div>

                

              </React.Fragment>
            ): (
              <React.Fragment>
                {/* Node System */}
                {dialogues.dialogues.map(dialogueInstance => (
                  <Node key={dialogueInstance.id} id={dialogueInstance.id} text={dialogueInstance.text} options={dialogueInstance.dialogueOptions} />
                ))}
              </React.Fragment>
            )}
            
            
          </div>

          

        </div>        
      </main>
    </>
  )
}
