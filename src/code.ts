import { TextDisplayLib } from "./interfaces/IfcCollection";

figma.showUI(__html__, { themeColors: true, width: 520, height: 600 });

figma.ui.onmessage = async ({eventAct, responses}) => {

  console.log('eventAct received : ', eventAct);
  console.log('responses received : ', responses);

  const importNodeSet = async (_id :string) => {
    let importComponentSet = await figma.importComponentSetByKeyAsync(_id) as ComponentSetNode;
    return importComponentSet;
  }

  const importNode = async (_id :string, variantIdx? :string) => {
    return await figma.importComponentByKeyAsync(_id) as ComponentNode;
  }

  const frame = figma.createFrame();

  const loadFontsFromInstance = async (instance) => {
    let textNodesLib = instance.findAll((n) => {
      return n.type === "TEXT";
    }) as TextNode[];
    await Promise.all(textNodesLib.map(async (t)=>{
        await Promise.all(
          t.getRangeAllFontNames(0, t.characters.length).map(figma.loadFontAsync)
        );
      })
    );
  }

  // Move to (50, 50)
  frame.x = 50
  frame.y = 50

  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.itemSpacing = 25;
  
  // Set size to 1280 x 720
  frame.resize(375, frame.height);
  frame.fills = [];

  // action/event tag id
  // 6009fab75366968afe8634049e48f8476fdb0c24
  // response tag id
  // 5d05b43edd873aae8f0c746fc30bae84bf619d24

  let eventActInstance = (await importNode("6009fab75366968afe8634049e48f8476fdb0c24")).createInstance();
  let responseComponentSet = await importNodeSet("5d05b43edd873aae8f0c746fc30bae84bf619d24");

  /*
    {
      "eventAct": "",
      "responses": [
          {
              "response": "",
              "condition": "",
              "direction": 1,
              "destinationLabel": "",
              "destinationType": 0
          }
      ]
    }
  */

  frame.appendChild(eventActInstance);
  await loadFontsFromInstance(eventActInstance);
  

  for (let i = 0; i < responses.length; i++) {
    const { response, condition, direction, destinationLabel, destinationType } = responses[i];
    console.log('response', responses[i]);
    // ie. direction=forward, condition=FALSE, destination-type=undefined
    const ndx = `direction=${direction < 0 ? 'backward': direction == 1 ? 'forward' : 'diverted'}, condition=${condition !== "" ? 'TRUE' : 'FALSE'}, destination-type=${direction !== 2 ? 'undefined' : destinationType == 0 ? 'flow' : 'screen'}`;
    let variantFound = responseComponentSet.findOne(node => node.type == "COMPONENT" && node.name === ndx) as ComponentNode;
    let responseInstance = (variantFound !== null ? variantFound : responseComponentSet.defaultVariant).createInstance();
    console.log('ndx', ndx);
    console.log('responseInstance', responseInstance);
    
    frame.appendChild(responseInstance);

    await loadFontsFromInstance(responseInstance);
    
    // let textNodesLib = responseInstance.findAll((n) => {
    //   return n.type === "TEXT";
    // }) as TextNode[];
    // await Promise.all(textNodesLib.map(async (t)=>{
    //     await Promise.all(
    //       t.getRangeAllFontNames(0, t.characters.length).map(figma.loadFontAsync)
    //     );
    //   })
    // );

    // console.log('textNodesLib', textNodesLib);
    /*
      {
        condition,
        response,
        tag-number
      }
    */
    /*
      condition : "", // if....
      response : "", // Direct to ...
      direction : 1, // ie. -1=Back, 1=Forward, 2=Diverted
      destinationLabel : "", // Page number, ie. A1.1.1
      destinationType : 0, // ie. 0=Section, 1=Screen
    */
   if (condition !== '') {
    let TNCondition = responseInstance.findOne(n=>n.name === 'condition') as TextNode
    TNCondition.characters = condition;
   }

   if (response !== '') {
    let TNResponse = responseInstance.findOne(n=>n.name === 'response') as TextNode
    TNResponse.characters = response;
   }

   if (destinationLabel !== '') {
    let TNDestLabel = responseInstance.findOne(n=>n.name === 'tag-number') as TextNode
    TNDestLabel.characters = destinationLabel;
   }
    
    
  }
  

  figma.closePlugin();
};
