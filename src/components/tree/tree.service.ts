
  export const editNodeInTree = (
        tree: any[], 
        newObj: any 
    ): any => (

    tree.map((node) => {
      if (node.id === newObj.id) {
        return {
          ...node,
          equipmentCosts: newObj.equipmentCosts,
          estimatedProfit: newObj.estimatedProfit,
          overheads: newObj.overheads,
          rowName: newObj.rowName,
          salary: newObj.salary
        }
      } else if (node.child) {
        return {
          ...node,
          child: editNodeInTree(
            node.child, 
            newObj
          )
        }
      } else {
        return node
      }
    })
  )

  export const editVirtualNodeInTree = (
      tree: any[], 
      newObj: any 
  ): any => (

  tree.map((node) => {
    if (node.id === -1) {
      
      return {
        ...node,
        equipmentCosts: newObj.equipmentCosts,
        estimatedProfit: newObj.estimatedProfit,
        id: newObj.id,
        overheads: newObj.overheads,
        rowName: newObj.rowName,
        salary: newObj.salary
      }
    } else if (node.child) {
      return {
        ...node,
        child: editVirtualNodeInTree(
          node.child, 
          newObj
        )
      }
    } else {
      return node
    }
  })
  )

  export const findNode = (tree: any[], id: any): any => {
    
    for(let obj of tree) {
        if (obj.id === id) {
            return obj;
        }
        if(obj.child) {
            let result = findNode(obj.child, id);
            if (result) {
                return result;
            }
        }
    }
    return undefined;
  };

  export function addNodeInTree(
    tree: any[], 
    parentNode: number | null, 
    newObj: any 
  ): any {
    const newTree = tree
    if(parentNode === null) {
      newTree.push(newObj);
    } else {
      newTree.map((node) => {
        if (node.id === parentNode) {
          let currentChild = node.child;
          currentChild.push(newObj);
          return {
            ...node,
            child: currentChild
          }
        } else if (node.child) {
          return {
            ...node,
            child: addNodeInTree(
              node.child, 
              parentNode, 
              newObj
            )
          }
        } else {
          return node
        }
      })
    }
    return newTree;
  }

  export const removeNodeInTree = (
    tree: any[],
    id: number
  ): any => (
    tree.map(node => { return {...node} }).filter(node => {
        if (node.child) {
          node.child = removeNodeInTree(node.child, id);
        }
        return node.id !== id;
    })
  )

  export function getDepth(
    localTree: any[],
    depth: number = 0
  ) {
    depth += localTree.length;
    for(let node of localTree) {
      if(node.child.length > 0) {
        depth += getDepth(node.child, depth);
      }
    }
    console.log(depth);
    
    return depth;
  }

  export function isContinuation(
    nodes: any[] 
  ) {
    for(let node of nodes) {
      if(node.child.length > 0) {
        return true;
      }
    }
    return false
  }
