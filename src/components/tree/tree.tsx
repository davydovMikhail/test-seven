import { useEffect, useState, useRef } from 'react';
import s from './tree.module.scss';
import file from "../../img/file.svg";
import trash from "../../img/trash.svg";
import { useGet } from "../../hooks/useGet";
import { useUpdate } from "../../hooks/useUpdate";
import { useCreate } from "../../hooks/useCreate";
import { useDelete } from "../../hooks/useDelete";
import { findNode, editNodeInTree, addNodeInTree, editVirtualNodeInTree, removeNodeInTree } from "./tree.service";
import clsx from "clsx";
import { toast } from "react-toastify";
    
function Tree() {
    const getHook = useGet();
    const updateHook = useUpdate();
    const createHook = useCreate();
    const deleteHook = useDelete();
    const [rowList, setRowList] = useState<any[]>([]);

    const [hover, setHover] = useState(0);


    const [ renamingNowUniqueId, setRenamingNowUniqueId ] = useState(0);

    const [ renamingNowName, setRenamingNowName ] = useState('');
    const [ renamingNowSalary, setRenamingNowSalary ] = useState(0);
    const [ renamingNowEquipment, setRenamingNowEquipment ] = useState(0);
    const [ renamingNowOverheads, setRenamingNowOverheads ] = useState(0);
    const [ renamingNowProfit, setRenamingNowProfit ] = useState(0);

    useEffect(
        () => {
            const fetchList = async () => {
                const List = await getHook();
                setRowList(List);
            }
            fetchList().catch(console.error);
        },
        []
    );  

    const handleStartRenameNode = (id: number) => {
        if(renamingNowUniqueId !== 0) {
            toast.info('Сначала закончите редактирование другой строки', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return
        }
        const targetNode = findNode(rowList, id);
            
        setRenamingNowUniqueId(id);

        setRenamingNowName(targetNode.rowName)
        setRenamingNowSalary(targetNode.salary)
        setRenamingNowEquipment(targetNode.equipmentCosts)
        setRenamingNowOverheads(targetNode.overheads)
        setRenamingNowProfit(targetNode.estimatedProfit)
      }

      const addVirtualNode = (parentId: number | null) => {
        if(renamingNowUniqueId !== 0) {
            toast.info('Выйдите из режима редактирования', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return 
        }
        setRenamingNowUniqueId(-1);
        const newTree = addNodeInTree(
            rowList,
            parentId,
            {
                equipmentCosts: 0,
                estimatedProfit: 0,
                id: -1,
                overheads: 0,
                rowName: "",
                salary: 0,
                child: []
            }
        );
        setRowList(newTree);
      }

      const removeNode = async (id: number) => {
        const deleted = await deleteHook(id);
        let newTree;
        newTree = removeNodeInTree(rowList, id);
        for(let obj of deleted.changed) {
            newTree = editNodeInTree(newTree, obj);
        }
        setRowList(newTree);
      }
 
      const catchControlKeysWhenEditNodeName = async (e: any, Id: number, parentId: number | null) => {
        if (e.key === 'Enter') {
            
            let newTree;
            if (renamingNowUniqueId === -1) {
                const created = await createHook(
                    parentId,
                    renamingNowName,
                    renamingNowSalary,
                    renamingNowEquipment,
                    renamingNowOverheads,
                    renamingNowProfit
                );
                newTree = editVirtualNodeInTree(rowList, created.current);
                for(let obj of created.changed) {
                    newTree = editNodeInTree(newTree, obj);
                }
            } else {
                
                const updated = await updateHook(
                    Id,
                    renamingNowName,
                    renamingNowSalary,
                    renamingNowEquipment,
                    renamingNowOverheads,
                    renamingNowProfit
                );   
                newTree = editNodeInTree(rowList, updated.current);
                for(let obj of updated.changed) {
                    newTree = editNodeInTree(newTree, obj);
                }
            }
            setRowList(newTree);
            undoRenaming();
        }
    
        if (e.key === 'Escape') {
            if (renamingNowUniqueId === -1) {
                let newTree;
                newTree = removeNodeInTree(rowList, -1);
                setRowList(newTree);
            } 
            undoRenaming();
        } 
      }

    const undoRenaming = () => {
        setRenamingNowUniqueId(0);
        setRenamingNowName('');
        setRenamingNowSalary(0);
        setRenamingNowEquipment(0);
        setRenamingNowOverheads(0);
        setRenamingNowProfit(0);
      }

    const buildTree = (tree: any[], isParent: boolean, parentId: number | null) => {
        const mappedNodes: any = tree.map((node, index) => {
            
            const isInputDisabled = renamingNowUniqueId !== node.id;
            const parent = parentId;

            return (
                <>
                    <div className={s.section} 
                        key={node.id}
                        onMouseEnter={() => setHover(node.id)}
                        onMouseLeave={() => setHover(0)}
                        onDoubleClick={() => handleStartRenameNode(node.id)}
                    >
                        <div className={s.section__item + " " + s.section__level}>
                            <div 
                               className={clsx(s.section__icon, {
                                [s.section__icon_hover]: hover === node.id,
                              })}
                            >
                                <button 
                                    onClick={() => {addVirtualNode(node.id)}} 
                                    className={s.section__img}
                                    disabled={renamingNowUniqueId === -1}
                                >
                                    <img  src={file} alt="file" />
                                </button>
                                {  isParent &&
                                    <>
                                        <div className={s.section__line + " " + s.section__line_vertical} />
                                        <div className={s.section__line + " " + s.section__line_gorizont} />
                                    </>
                                }
                            </div>
                            {hover === node.id && renamingNowUniqueId === 0 &&
                                <button 
                                    className={s.section__icon + " " + s.section__icon_hover}
                                    onClick={() => removeNode(node.id)}
                                >
                                    <img src={trash} alt="trash" />
                                </button>
                            }
                        </div>
                        <input 
                            className={ isInputDisabled ? s.section__item : s.section__input} 
                            disabled={isInputDisabled}
                            type="text" 
                            value={(renamingNowUniqueId === node.id ? renamingNowName : node.rowName)}
                            data-unique-id={node.id + "name"}
                            onKeyDown={(e: any) => catchControlKeysWhenEditNodeName(e, node.id, parent)}
                            onChange={(e) => setRenamingNowName(e.target.value)}
                        />
                        <input
                            className={isInputDisabled ? s.section__item : s.section__input} 
                            disabled={isInputDisabled}
                            type="number"
                            value={(renamingNowUniqueId === node.id ? renamingNowSalary : node.salary)}
                            data-unique-id={node.id + "salary"} 
                            onKeyDown={(e: any) => catchControlKeysWhenEditNodeName(e, node.id, parent)}
                            onChange={(e) => setRenamingNowSalary(Number(e.target.value))}
                        />
                        <input 
                            className={isInputDisabled ? s.section__item : s.section__input} 
                            disabled={isInputDisabled}
                            type="number"
                            value={(renamingNowUniqueId === node.id ? renamingNowEquipment : node.equipmentCosts)}
                            data-unique-id={node.id + "equipment"} 
                            onKeyDown={(e: any) => catchControlKeysWhenEditNodeName(e, node.id, parent)}
                            onChange={(e) => setRenamingNowEquipment(Number(e.target.value))}
                        />
                        <input 
                            className={isInputDisabled ? s.section__item : s.section__input} 
                            disabled={isInputDisabled}
                            type="number" 
                            value={(renamingNowUniqueId === node.id ? renamingNowOverheads : node.overheads)}
                            data-unique-id={node.id + "overheads"}
                            onKeyDown={(e: any) => catchControlKeysWhenEditNodeName(e, node.id, parent)}
                            onChange={(e) => setRenamingNowOverheads(Number(e.target.value))}
                        />
                        <input 
                            className={isInputDisabled ? s.section__item : s.section__input} 
                            disabled={isInputDisabled}
                            type="number"
                            value={(renamingNowUniqueId === node.id ? renamingNowProfit : node.estimatedProfit)}
                            data-unique-id={node.id + "profit"}
                            onKeyDown={(e: any) => catchControlKeysWhenEditNodeName(e, node.id, parent)}
                            onChange={(e) => setRenamingNowProfit(Number(e.target.value))}
                        />
                    </div>
                    <div className={s.parent}>
                        { node.child.length > 0 &&
                                <div 
                                    className={s.parent__continuation}
                                >
                                </div>
                        }
                        
                        {node.child ? buildTree(node.child, node.child.length > 0, node.id) : null}
                    </div>
                </>
            )
        });
        return mappedNodes;
    }    

    return (
        <>
            <div className={s.treeWrapper}>
                {rowList.length
                    ? buildTree(rowList, false, null)
                    : <div className={s.treeWrapper__no}>Нет данных</div>
                }
                <div onClick={() => {addVirtualNode(null)}} className={s.add}>
                    <div className={s.add__text}>
                        +
                    </div>
                    <img src={file} alt="file" />
                </div>
            </div>
        </>
        
    ) 
}

export default Tree;