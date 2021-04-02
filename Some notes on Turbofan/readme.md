# Understand Turbofan...

https://doar-e.github.io/blog/2019/01/28/introduction-to-turbofan/#experimenting-with-the-optimization-phases

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