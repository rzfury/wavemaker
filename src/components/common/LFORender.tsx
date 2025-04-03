import { useEffect, useRef, useState } from 'react';

export default function LFORender({
  lfo,
  onAddNode,
  onRemoveNode,
  onChangeNode,
  onChangeEdgeNode,
}: {
  lfo: LFOState,
  onAddNode: (i: number, amt: number, t: number) => void,
  onRemoveNode: (i: number) => void,
  onChangeNode: (i: number, amt: number, t: number) => void,
  onChangeEdgeNode: (amt: number) => void,
}) {
  const CANVAS_RESOLUTION = 1;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<number>(-1);
  const [selectedEdgeNode, setSelectedEdgeNode] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<[number, number]>([0.0, 0.0]);

  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      const { width, height } = canvas.getBoundingClientRect();
      const strokeWidth = 2 * CANVAS_RESOLUTION;

      canvas.width = width * CANVAS_RESOLUTION;
      canvas.height = height * CANVAS_RESOLUTION;

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#121613';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.lineWidth = strokeWidth;

      context.beginPath();
      context.moveTo(lfo.current.time * canvas.width, 0);
      context.lineTo(lfo.current.time * canvas.width, canvas.height);
      context.strokeStyle = "yellow";
      context.stroke();

      context.beginPath();
      context.moveTo(0, (1.0 - lfo.edgeNode.amount) * canvas.height);
      for (let i = 0; i < lfo.nodes.length; i++) {
        const x = lfo.nodes[i].time * canvas.width;
        const y = (1.0 - lfo.nodes[i].amount) * canvas.height;
        context.lineTo(x, y);
      }
      context.lineTo(canvas.width, (1.0 - lfo.edgeNode.amount) * canvas.height);
      context.strokeStyle = "lime";
      context.stroke();

      for (let i = 0; i < lfo.nodes.length; i++) {
        const x = lfo.nodes[i].time * canvas.width;
        const y = (1.0 - lfo.nodes[i].amount) * canvas.height;
        context.fillStyle = "lime";
        context.fillRect(x - 5, y - 5, 10, 10);
      }

      context.fillStyle = "lime";
      context.fillRect(-5, (canvas.height * (1.0 - lfo.edgeNode.amount)) - 5, 10, 10);
      context.fillRect(canvas.width - 5, (canvas.height * (1.0 - lfo.edgeNode.amount)) - 5, 10, 10);

      const intersect = findIntersection(lfo.current.time);
      if (intersect) {
        const x = intersect.time * canvas.width;
        const y = (1.0 - intersect.amount) * canvas.height;
        context.fillStyle = "yellow";
        context.fillRect(x - 5, y - 5, 10, 10);
      }
    }
  }

  const findIntersection = (time: number) => {
    const nodes = [
      { time: 0, amount: lfo.edgeNode.amount },
      ...lfo.nodes,
      { time: 1, amount: lfo.edgeNode.amount },
    ];

    for (let i = 0; i < nodes.length - 1; i++) {
      let node = nodes[i];
      let nextNode = nodes[i + 1];

      if (time >= node.time && time <= nextNode.time) {
        let amt = node.amount + ((nextNode.amount - node.amount) / (nextNode.time - node.time)) * (time - node.time);
        return { time, amount: amt };
      }
    }

    return null;
  }

  useEffect(() => {
    render();
  }, [render]);

  useEffect(() => {

  }, []);

  function mouseMoveCallback(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (canvasRef.current) {
      const bounding = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / bounding.width;
      const scaleY = canvasRef.current.height / bounding.height;
      const pos = [
        (e.clientX - bounding.left) * scaleX,
        (e.clientY - bounding.top) * scaleY,
      ];
      const [t, amt] = [pos[0] / bounding.width, 1.0 - (pos[1] / bounding.height)];

      setMousePos(pos as [number, number]);

      if (selectedNode >= 0) {
        if (lfo.nodes.length > 1) {
          if (selectedNode === 0) {
            const rightNode = lfo.nodes[selectedNode + 1];

            if (t < rightNode.time) {
              onChangeNode(selectedNode, amt, t);
            }
          }
          else if (selectedNode === lfo.nodes.length - 1) {
            const leftNode = lfo.nodes[selectedNode - 1];

            if (t > leftNode.time) {
              onChangeNode(selectedNode, amt, t);
            }
          }
          else if (selectedNode > 0 && selectedNode + 1 < lfo.nodes.length) {
            const leftNode = lfo.nodes[selectedNode - 1];
            const rightNode = lfo.nodes[selectedNode + 1];

            if (t > leftNode.time && t < rightNode.time) {
              onChangeNode(selectedNode, amt, t);
            }
          }
        }
        else if (lfo.nodes.length === 1) {
          onChangeNode(selectedNode, amt, t);
        }
      }
      else if (selectedEdgeNode) {
        onChangeEdgeNode(amt);
      }
    }
  }

  function mouseDownCallback() {
    if (selectedEdgeNode) return;
    if (selectedNode >= 0) return;
    if (!canvasRef.current) return;

    const bounding = canvasRef.current.getBoundingClientRect();
    const [t, amt] = [mousePos[0] / bounding.width, 1.0 - (mousePos[1] / bounding.height)];

    for (let i = 0; i < lfo.nodes.length; i++) {
      const node = lfo.nodes[i];

      const cx = (node.time - t) * (node.time - t);
      const cy = (node.amount - amt) * (node.amount - amt);
      const dist = Math.sqrt(cx + cy);

      if (dist < 0.05) {
        setSelectedNode(i);
        return;
      }
    }

    if (t < 0.02 || t > 0.97) {
      setSelectedEdgeNode(true);
    }
  }

  function mouseUpCallback() {
    setSelectedNode(-1);
    setSelectedEdgeNode(false);
  }

  function doubleClickCallback() {
    if (!canvasRef.current) return;
    const bounding = canvasRef.current.getBoundingClientRect();
    const [t, amt] = [mousePos[0] / bounding.width, 1.0 - (mousePos[1] / bounding.height)];

    let insertIndex = -1;

    for (let i = 0; i < lfo.nodes.length; i++) {
      const node = lfo.nodes[i];

      const cx = (node.time - t) * (node.time - t);
      const cy = (node.amount - amt) * (node.amount - amt);
      const dist = Math.sqrt(cx + cy);

      if (dist < 0.05) {
        onRemoveNode(i);
        if (selectedNode === i) {
          setSelectedNode(-1);
        }
        return;
      }

      if (insertIndex === -1 && t < node.time) {
        insertIndex = i;
      }
    }

    onAddNode(insertIndex, amt, t);
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onMouseMove={mouseMoveCallback}
      onMouseDown={mouseDownCallback}
      onMouseUp={mouseUpCallback}
      onMouseLeave={mouseUpCallback}
      onDoubleClick={doubleClickCallback}
    />
  );
}
