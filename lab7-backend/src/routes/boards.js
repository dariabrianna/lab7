const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const auth = require("../middleware/auth");
const paginate = require("../middleware/paginate");

/*  GET /boards?skip=0&limit=20  */
router.get("/", auth(["READ"]), paginate, async (req, res) => {
  const boards = await prisma.board.findMany({
    skip: req.pagination.skip,
    take: req.pagination.take,
    include: { cards: { include: { tasks: true } } },
  });
  res.json(boards);
});

/*  POST /boards  */
router.post("/", auth(["WRITE"]), async (req, res) => {
  try {
    const { title } = req.body;
    const board = await prisma.board.create({ data: { title } });
    res.status(201).json(board);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/*  PATCH /boards/:id  */
router.patch("/:id", auth(["WRITE"]), async (req, res) => {
  try {
    const board = await prisma.board.update({
      where: { id: +req.params.id },
      data: req.body,
    });
    res.json(board);
  } catch {
    res.status(404).json({ error: "Board not found" });
  }
});

/*  DELETE /boards/:id  */
router.delete("/:id", auth(["WRITE"]), async (req, res) => {
  try {
    await prisma.board.delete({ where: { id: +req.params.id } });
    res.sendStatus(204);
  } catch {
    res.status(404).json({ error: "Board not found" });
  }
});

module.exports = router;
