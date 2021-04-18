# Some d8 internals can be found in the Slide Practice pdf

# Understand Turbofan...

https://doar-e.github.io/blog/2019/01/28/introduction-to-turbofan/#experimenting-with-the-optimization-phases

## Modification from Pico Docker build
After compile d8,

Start the container:
docker create --name temp_container v8_builder 

Copy the source code:
docker cp temp_container:/home/builder/v8/ new/

Set breakpoint on interested function: (this is done on gdb-gef)
break OperationTyper::NumberAbs
break OperationTyper::NumberAdd
break ../../src/compiler/operation-typer.cc:345



## Random

- JSCall node correspond to the builtin (eg Math.random)

- Call target is a Code Stub Assembler implementation of a builtin function, TurboFan simply creates a LoadField node and change the opcode of the JSCall node to a Call opcode


switch (node->opcode()) {
    case IrOpcode::kNumberAdd:
      return ReduceAddition(node); //ReduceAddition is called when the OpCode is kNumberAdd
	  
//This means the left->opcode must be NumberAdd
//since node->Opcode() = NumberAdd
Node* left = NodeProperties::GetValueInput(node, 0);
  if (left->opcode() != node->opcode()) {
    return NoChange(); // [1]
  }

//Right must be a kNumberConstant
  Node* right = NodeProperties::GetValueInput(node, 1);
  if (right->opcode() != IrOpcode::kNumberConstant) {
    return NoChange(); // [2]
  }

//parent_right must be a NumberConstant
  Node* parent_left = NodeProperties::GetValueInput(left, 0);
  Node* parent_right = NodeProperties::GetValueInput(left, 1);
  if (parent_right->opcode() != IrOpcode::kNumberConstant) {
    return NoChange(); // [3]
  }

//hence the last case!

For example:
//a is the parent_left
//2 is the parent_right (number constant)
//1 is the node->right (number constant)
func(a){
	return a + 2 + 1;
}

This will be reduced to:
	a + 3 (number constant)



# CTF HTB Pwnathon
There is a maybe type in javascript,
to help compiler decide on the type of object
that a function takes

NumberAbs removed the type maybe_nan
NaN none is allowed??


Feed NaN type???

When the Typer runs, it visits every node of the graph and tries to reduce them.

So it doesnt reduce NaN / Maybe type?

function is a builtin, it will associate a Type with it. For instance, in the case of a call to the MathRandom builtin, it knows that the expected return type is a Type::PlainNumber


ideas: 
expected type = NaN / Maybe??

//This is triggering breakpoint
let opt_me = (x) => {
  x = x + 1;
  x = x + 1;
  return Math.abs(x);
}

for (i = 0; i < 0x10000; i++){
	console.log(opt_me(Infinity));
}
%OptimizeFunctionOnNextCall(opt_me);
let res = opt_me("foo");
console.log(res);

Since maybe_minuszero is just on top, I will try to analyse that
triggering maybe_minuszero can be done like this

In this case, the typer is saying that the type of the Math.Abs 
function is always Union(PlainNumber, NaN)