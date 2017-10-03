import * as path from "path";
import "should";
import * as vscode from "vscode";

import { addText, clearActiveTextEditor, fixturePath, newTextDocument } from "./helpers";

import BslQuickOpen from "../src/features/bslQuickOpen";
import { Global } from "../src/global";
import * as vscAdapter from "../src/vscAdapter";

const globals = Global.create(vscAdapter);

let textDocument: vscode.TextDocument;

describe("MetadataParse", () => {

    before(async () => {
        const uriFile = vscode.Uri.file(
            path.join(fixturePath, "CommonModules", "CommonModule", "Ext", "Module.bsl")
        );
        textDocument = await newTextDocument(uriFile);
        await globals.waitForCacheUpdate();
    });

    beforeEach(async () => {
        await clearActiveTextEditor();
    });

    it("should be avaliable metadata data", async () => {
        const quick = new BslQuickOpen(globals);
        globals.dbmodules.chain().data().length.should.greaterThan(1);

    });

    it("should be avaliable CommonModule metadata", async () => {
        const metadata = globals.dbmodules.chain().find({parenttype: "CommonModules"}).data();
        metadata.length.should.greaterThan(0);
        metadata[0].should.has.a.key("parenttype").which.is.equal("CommonModules");
    });

    it("should be avaliable Catalogs metadata", async () => {
        const metadata = globals.dbmodules.chain().find({parenttype: "Catalogs"}).data();
        metadata.length.should.greaterThan(0);
        metadata[0].should.has.a.key("parenttype").which.is.equal("Catalogs");
        metadata[0].should.has.a.key("module").which.is.match("Catalogs._ДемоБанковскиеСчета");
    });

    it("should be avaliable Documents metadata", async () => {
        const metadata = globals.dbmodules.chain().find({parenttype: "Documents"}).data();
        metadata.length.should.greaterThan(0);
        metadata[0].should.has.a.key("parenttype").which.is.equal("Documents");
    });

    it("should be return human name", async () => {
        const metadata = globals.dbmodules.chain().data();
        globals.getHumanMetadata(metadata[0]).should
            .equals("Справочники._ДемоБанковскиеСчета._ДемоБанковскиеСчета.МодульОбщий");
    });

    it("should be return human name in En", async () => {
        globals.autocompleteLanguage = "en";
        const metadata = globals.dbmodules.chain().data();
        globals.getHumanMetadata(metadata[0]).should
            .equals("Catalogs._ДемоБанковскиеСчета._ДемоБанковскиеСчета.CommandModule");
    });

});